import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";
import { isValidObjectId } from "mongoose";

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const requiredFields = ["name", "email", "phone", "message"];

    if (validateFields(req.body, requiredFields, res) !== true) {
      return;
    }

    const newEnquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
    });

    if (!newEnquiry) {
      return res
        .status(500)
        .json(new ApiRes(409, null, "Failed to create enquiry"));
    }

    return res
      .status(200)
      .json(new ApiRes(200, newEnquiry, "Enquiry created successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getEnquiries = asyncHandler(async (req, res) => {
  try {
    const enquiries = await Enquiry.find().select("-__v -createdAt -updatedAt");
    return res
      .status(200)
      .json(new ApiRes(200, enquiries, "Enquiries fetched successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const setEnquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing enquiry ID"));
  }

  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    ).select("-__v -createdAt -updatedAt");

    if (!updatedEnquiry) {
      return res.status(404).json(new ApiRes(404, null, "Enquiry not found"));
    }

    return res
      .status(200)
      .json(
        new ApiRes(200, updatedEnquiry, "Enquiry status updated successfully")
      );
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export { createEnquiry, getEnquiries, setEnquiryStatus };
