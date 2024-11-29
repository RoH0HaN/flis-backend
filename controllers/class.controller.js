import { Class, Section } from "../models/class.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";
import mongoose, { isValidObjectId } from "mongoose";

const createClass = asyncHandler(async (req, res) => {
  try {
    const { name, minAge, maxAge, feesMasters, description } = req.body;

    const requiredFields = [
      "name",
      "minAge",
      "maxAge",
      "feesMasters",
      "description",
    ];

    // Use the utility function
    if (validateFields(req.body, requiredFields, res) !== true) {
      return;
    }

    if (!Array.isArray(feesMasters) || !feesMasters.every(isValidObjectId)) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Invalid feeMasters ObjectId(s)"));
    }

    const existingClass = await Class.findOne({ name, minAge, maxAge });

    if (existingClass) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Class already exists"));
    }

    const newClass = new Class({
      name,
      minAge,
      maxAge,
      feesMasters,
      description,
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
  const { name, minAge, maxAge, description } = req.body;

  // Check if `id` is valid
  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing class ID"));
  }

  const requiredFields = ["name", "minAge", "maxAge", "description"];

  // Use the utility function
  if (validateFields(req.body, requiredFields, res) !== true) {
    return;
  }

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        name,
        minAge,
        maxAge,
        description,
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

const createSection = asyncHandler(async (req, res) => {
  try {
    const { name, classId, maxStudents } = req.body;

    const requiredFields = ["name", "classId", "maxStudents"];

    // Use the utility function
    if (validateFields(req.body, requiredFields, res) !== true) {
      return;
    }

    const classExist = await Class.findById(classId);

    if (!classExist) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Class not found with this ID"));
    }

    const existingSection = await Section.findOne({ name, classId });

    if (existingSection) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Section already exists"));
    }

    const newSection = new Section({
      name,
      classId,
      maxStudents,
    });

    await newSection.save();

    classExist.sections.push(newSection._id);
    await classExist.save();

    return res
      .status(201)
      .json(new ApiRes(201, newSection, "Section created successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getAllClasses = asyncHandler(async (req, res) => {
  try {
    const classes = await Class.find({})
      .select("-__v -createdAt -updatedAt -feesMasters -description")
      .populate({
        path: "sections",
        select: "-__v -createdAt -updatedAt -classId",
      });

    return res
      .status(200)
      .json(new ApiRes(200, classes, "Classes fetched successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export { createClass, deleteClass, updateClass, createSection, getAllClasses };
