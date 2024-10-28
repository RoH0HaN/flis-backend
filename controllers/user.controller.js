import { User } from "../models/user.models.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const validateEmail = (email) => {
  const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regEx.test(email);
};

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (
    validateFields(req.body, ["name", "email", "password", "role"], res) !==
    true
  ) {
    return;
  }

  try {
    const emailIsValid = validateEmail(email);
    if (!emailIsValid) {
      return res.status(400).json(new ApiRes(400, null, "Email is not valid"));
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(500)
        .json(new ApiRes(500, null, "user with same email already exist"));
    }

    await User.create({
      name: name,
      email: email,
      password: password,
      role: role,
    });

    return res
      .status(200)
      .json(new ApiRes(201, null, "user created successfully"));
  } catch (error) {
    console.log(error);

    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (validateFields(req.body, ["email", "password"], res) !== true) {
    return;
  }

  try {
    if (!validateEmail(email))
      return res.status(400).json(new ApiRes(400, null, "Email is invalid."));
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json(new ApiRes(404, null, "user not found"));
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(400).json(new ApiRes(400, null, "Invalid credentials"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refresh_token -__v -createdAt -updatedAt"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiRes(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "Login successful"
        )
      );
  } catch (error) {
    console.log(error);

    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          refresh_token: "",
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiRes(200, {}, "Logged out successfully."));
  } catch (error) {
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token)
    return res.status(401).json(new ApiRes(401, null, "Unauthorized Access."));

  try {
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!user)
      return res
        .status(401)
        .json(new ApiRes(401, null, "Invalid refresh token."));

    if (user?.refresh_token !== token)
      return res
        .status(401)
        .json(
          new ApiRes(401, null, "Refresh token is either expired or used.")
        );
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiRes(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(new ApiRes(401, null, error?.message || "Invalid Access Token."));
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (validateFields(req.body, ["oldPassword", "newPassword"], res) !== true) {
    return;
  }

  if (oldPassword === newPassword)
    return res
      .status(400)
      .json(new ApiRes(400, null, "New password cannot be the same as old."));
  try {
    const user = await User.findById(req.user?._id);

    if (!user)
      return res
        .status(500)
        .json(
          new ApiRes(
            500,
            null,
            "Something went wrong while fetching user from database."
          )
        );

    const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isOldPasswordValid)
      return res
        .status(401)
        .json(new ApiRes(401, null, "Old password is invalid."));

    user.password = newPassword;
    const updatedUser = await user.save({ validateBeforeSave: false });

    const isPasswordChanged = await updatedUser.isPasswordCorrect(newPassword);

    if (!isPasswordChanged)
      return res
        .status(500)
        .json(
          new ApiRes(
            500,
            null,
            "Something went wrong while updating the password."
          )
        );

    return res
      .status(200)
      .json(new ApiRes(200, null, "Password changed successfully."));
  } catch (error) {
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getCurrentUserDetails = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json(new ApiRes(401, null, "Unauthorized user"));
  }

  try {
    const loggedUser = await User.findById(user._id);

    return res.status(200).json(new ApiRes(200, loggedUser, "user details"));
  } catch (error) {
    console.log(error);

    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export {
  createUser,
  loginUser,
  logout,
  refreshAccessToken,
  changePassword,
  getCurrentUserDetails,
};
