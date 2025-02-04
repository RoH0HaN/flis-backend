import { Class, Section } from "../models/class.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";
import mongoose, { isValidObjectId } from "mongoose";

const createClass = asyncHandler(async (req, res) => {
  try {
    const { name, minAge, maxAge, description } = req.body;

    const requiredFields = ["name", "minAge", "maxAge"];

    // Use the utility function
    if (validateFields(req.body, requiredFields, res) !== true) {
      return;
    }

    const existingClass = await Class.findOne({ name });

    if (existingClass) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Class already exists with this name"));
    }

    const newClass = new Class({
      name,
      minAge,
      maxAge,
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
      .select("-__v -createdAt -updatedAt")
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

// delete section
const deleteSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing section ID"));
  }

  try {
    const deletedSection = await Section.findByIdAndDelete(id);

    if (!deletedSection) {
      return res.status(404).json(new ApiRes(404, null, "Section not found"));
    }

    const classExist = await Class.findById(deletedSection.classId);

    if (classExist) {
      classExist.sections.pull(deletedSection._id);
      await classExist.save();
    }

    return res
      .status(200)
      .json(new ApiRes(200, null, "Section deleted successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

//utility function
const updateClassSections = async (sectionId, prevClassId, newClassId) => {
  if (!mongoose.isValidObjectId(prevClassId)) {
    throw new Error("Invalid previous class ID");
  }

  const prevClass = await Class.findById(prevClassId).select("sections");

  if (!prevClass) {
    throw new Error("Previous class not found");
  }

  // Remove section from previous class
  prevClass.sections.pull(sectionId);
  await prevClass.save();

  // If newClassId is valid, add the section to the new class
  if (newClassId && mongoose.isValidObjectId(newClassId)) {
    const newClass = await Class.findById(newClassId).select("sections");
    if (!newClass) {
      throw new Error("New class not found");
    }
    newClass.sections.push(sectionId);
    await newClass.save();
  }
};

// update section to update max students
const updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, maxStudents, classId } = req.body;

  // Check if `id` is valid
  if (
    !id ||
    !mongoose.isValidObjectId(id) ||
    !classId ||
    !mongoose.isValidObjectId(classId)
  ) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing section ID or class ID"));
  }

  try {
    const section = await Section.findById(id);

    if (!section) {
      return res.status(404).json(new ApiRes(404, null, "Section not found"));
    }

    section.name = name;
    section.maxStudents = maxStudents;

    if (!section.classId.equals(classId)) {
      await updateClassSections(id, section.classId, classId);
      section.classId = classId;
    }

    await section.save();

    return res
      .status(200)
      .json(new ApiRes(200, section, "Section updated successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

// delete section from class
// const detachSectionFromClass = asyncHandler(async (req, res) => {
//   const { sectionId, classId } = req.query;

//   if (
//     !sectionId ||
//     !mongoose.isValidObjectId(sectionId) ||
//     !classId ||
//     !mongoose.isValidObjectId(classId)
//   ) {
//     return res
//       .status(400)
//       .json(new ApiRes(400, null, "Invalid or missing section ID or class ID"));
//   }

//   try {
//     const section = await Section.findById(sectionId);
//     if (!section) {
//       return res.status(404).json(new ApiRes(404, null, "Section not found"));
//     }

//     await updateClassSections(sectionId, classId, null); // Only detach

//     // Set classId in section to an empty string
//     section.classId = "";
//     await section.save();

//     return res
//       .status(200)
//       .json(new ApiRes(200, null, "Section deleted successfully"));
//   } catch (error) {
//     Logger(error, "error");
//     return res.status(500).json(new ApiRes(500, null, error.message));
//   }
// });

export {
  createClass,
  deleteClass,
  updateClass,
  createSection,
  getAllClasses,
  deleteSection,
  updateSection,
};
