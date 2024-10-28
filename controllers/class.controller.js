import { Class } from "../models/class.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";
import mongoose from "mongoose";

const createClass = asyncHandler(async (req, res) => {
  try {
    const { name, description, academicYear } = req.body;

    const requiredFields = ["name", "description", "academicYear"];

    // Use the utility function
    if (validateFields(req.body, requiredFields, res) !== true) {
      return;
    }

    const newClass = new Class({
      name,
      description,
      academicYear,
    });

    await newClass.save();

    return res
      .status(201)
      .json(new ApiRes(201, newClass, "Class created successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const deleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if `id` is valid
  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing class ID"));
  }
  try {
    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json(new ApiRes(404, null, "Class not found"));
    }
    return res
      .status(200)
      .json(new ApiRes(200, null, "Class deleted successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const updateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, academicYear } = req.body;

  // Check if `id` is valid
  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing class ID"));
  }

  const requiredFields = ["name", "description", "academicYear"];

  // Use the utility function
  if (validateFields(req.body, requiredFields, res) !== true) {
    return;
  }

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        name,
        description,
        academicYear,
      },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json(new ApiRes(404, null, "Class not found"));
    }

    return res
      .status(200)
      .json(new ApiRes(200, null, "Class updated successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export { createClass, deleteClass, updateClass };
