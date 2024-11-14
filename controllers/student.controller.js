import { Student } from "../models/student.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { uploadImageToFirebase } from "../utils/upload.images.firebase.js";
import { deleteFromFirebase } from "../utils/delete.from.firebase.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";
import mongoose from "mongoose";

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
    class_info,
    session,
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
        "class_info",
        "session",
      ],
      res
    ) !== true
  ) {
    return;
  }

  try {
    const student = await Student.findOne({ applicationId: application_id });
    if (student) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Student already exists"));
    }
    if (req.file) {
      await deleteFromFirebase(student_details.student_photo);

      student_details.student_photo = await uploadImageToFirebase(
        req.file.path,
        "student_image"
      );
    }

    const newStudent = new Student({
      applicationId: application_id,
      student_details,
      parent_guardian_details,
      communication_address,
      other_details,
      class_info,
      session,
    });

    newStudent.currentStatus = "EDITED";

    await newStudent.save();

    return res
      .status(200)
      .json(new ApiRes(200, null, "Student created successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export { getCurrentStatus, createStudent };
