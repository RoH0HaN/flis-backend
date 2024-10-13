import { User } from "../models/user.models.js";
import { ApiRes } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Prefer Authorization header over cookies for token validation
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json(new ApiRes(401, null, "Unauthorized request."));
    }

    // Using async jwt.verify to avoid blocking the event loop
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          const message =
            err.name === "TokenExpiredError"
              ? "Token expired."
              : "Invalid access token.";
          return res.status(401).json(new ApiRes(401, null, message));
        }

        const user = await User.findById(decodedToken?._id).select(
          "-password -refreshToken -__v -createdAt -updatedAt"
        );

        if (!user) {
          return res
            .status(401)
            .json(new ApiRes(401, null, "Invalid access token."));
        }

        // Attach user to req object and proceed
        req.user = user;
        next();
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiRes(500, null, "Server error during authentication."));
  }
});
