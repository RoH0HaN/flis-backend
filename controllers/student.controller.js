import { Student } from "../models/student.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { uploadImageToFirebase } from "../utils/upload.images.firebase.js";
import { deleteFromFirebase } from "../utils/delete.from.firebase.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";
import mongoose from "mongoose";

const handleCreateOrUpdateStudent = async ({
  application_id,
  student_details,
  parent_guardian_details,
  communication_address,
  other_details,
  bank_details,
  admission_date,
  class_info,
  session,
  promotion_history,
  currentStatus,
}) => {
  if (!application_id || !mongoose.isValidObjectId(application_id)) {
    throw new Error("Application ID is required");
  }

  const updateFields = {};

  if (student_details) updateFields.student_details = student_details;
  if (parent_guardian_details)
    updateFields.parent_guardian_details = parent_guardian_details;
  if (communication_address)
    updateFields.communication_address = communication_address;
  if (other_details) updateFields.other_details = other_details;
  if (bank_details) updateFields.bank_details = bank_details;
  if (admission_date) updateFields.admission_date = admission_date;
  if (class_info) updateFields.class_info = class_info;
  if (session) updateFields.session = session;
  if (promotion_history) updateFields.promotion_history = promotion_history;
  if (currentStatus) updateFields.currentStatus = currentStatus;

  const student = await Student.findOne({ applicationId: application_id });
  if (student) {
    Object.assign(student, updateFields);
    // student.currentStatus = "EDITED"; // Ensure status is updated if applicable
    await student.save();
    return { message: "Student updated successfully", studentId: student._id };
  }

  const newStudent = new Student({
    applicationId: application_id,
    ...updateFields,
  });

  newStudent.currentStatus = "EDITED";
  await newStudent.save();

  return { message: "Student created successfully", studentId: newStudent._id };
};

const getCurrentStatus = asyncHandler(async (req, res) => {
  const { application_id } = req.params;

  if (!application_id || !mongoose.isValidObjectId(application_id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Application ID is required"));
  }
  try {
    const student = await Student.findOne({ applicationId: application_id });
    if (!student) {
      return res.status(404).json(new ApiRes(404, null, "Student not found"));
    }
    return res
      .status(200)
      .json(
        new ApiRes(
          200,
          student.currentStatus,
          "Current status fetched successfully"
        )
      );
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const createStudent = asyncHandler(async (req, res) => {
  const { application_id } = req.params;
  const {
    student_details,
    parent_guardian_details,
    communication_address,
    other_details,
    bank_details,
    // class_info,
    // session,
  } = req.body;

  if (!application_id || !mongoose.isValidObjectId(application_id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Application ID is required"));
  }

  if (
    validateFields(
      req.body,
      [
        "student_details",
        "parent_guardian_details",
        "communication_address",
        "other_details",
        "bank_details",
        // "class_info",
        // "session",
      ],
      res
    ) !== true
  ) {
    return;
  }

  try {
    const { message, studentId } = await handleCreateOrUpdateStudent({
      application_id,
      student_details,
      parent_guardian_details,
      communication_address,
      other_details,
      bank_details,
    });

    return res.status(200).json(new ApiRes(200, studentId, message));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export { getCurrentStatus, createStudent };
