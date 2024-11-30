import { Admission } from "../models/admission.model.js";
import { Section } from "../models/class.model.js";
import { StudentFees } from "../models/student.fees.model.js";
import { Student } from "../models/student.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";
import mongoose, { isValidObjectId } from "mongoose";

const handleCreateStudent = async ({
  application_id,
  student_details,
  parent_guardian_details,
  communication_address,
  other_details,
  bank_details,
  class_info,
  section_info,
  session_info,
}) => {
  if (!application_id || !mongoose.isValidObjectId(application_id)) {
    return {
      message: "Application ID is required",
      studentId: "",
    };
  }

  const student = await Student.findOne({ applicationId: application_id });

  if (student) {
    return {
      message: "Student already admitted",
      studentId: student._id,
    };
  }

  const newStudent = new Student({
    applicationId: application_id,
    student_details,
    parent_guardian_details,
    communication_address,
    other_details,
    bank_details,
    class_info,
    section_info,
    session_info,
  });

  newStudent.admission_date = new Date();
  newStudent.currentStatus = "FEES";
  await newStudent.save();

  const section = await Section.findById(section_info).select("currStudents");

  if (section) {
    section.currStudents += 1;
    await section.save();
  }

  return { message: "Student created successfully", studentId: newStudent._id };
};

const handleCreateOrUpdateStudent = async ({
  application_id,
  student_details,
  parent_guardian_details,
  communication_address,
  other_details,
  bank_details,
  class_info,
  section_info,
  session,
  fees_info,
  admission_date,
  promotion_history,
  currentStatus,
}) => {
  if (!application_id || !mongoose.isValidObjectId(application_id)) {
    return {
      message: "Application ID is required",
      studentId: "",
    };
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
  if (section_info) updateFields.section_info = section_info;
  if (session) updateFields.session = session;
  if (promotion_history) updateFields.promotion_history = promotion_history;
  if (currentStatus) updateFields.currentStatus = currentStatus;

  const student = await Student.findOne({ applicationId: application_id });
  if (student) {
    Object.assign(student, updateFields);
    await student.save();
    return { message: "Student updated successfully", studentId: student._id };
  }

  const newStudent = new Student({
    applicationId: application_id,
    ...updateFields,
  });

  newStudent.admission_date = new Date();
  newStudent.currentStatus = "FEES";
  await newStudent.save();

  const section = await Section.findById(section_info);

  section.currStudents += 1;
  await section.save();

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
    class_info,
    section_info,
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
        "bank_details",
        "class_info",
        "section_info",
        "session",
      ],
      res
    ) !== true
  ) {
    return;
  }

  try {
    const admission = await Admission.findById(application_id).select("_id");

    if (!admission) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Admission not found with this ID"));
    }

    const { message, studentId } = await handleCreateOrUpdateStudent({
      application_id,
      student_details,
      parent_guardian_details,
      communication_address,
      other_details,
      bank_details,
      class_info,
      section_info,
      session,
    });

    return res.status(200).json(new ApiRes(200, studentId, message));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getStudentsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;

  if (!status) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing status"));
  }

  try {
    // Only retrieve necessary fields to optimize performance
    const students = await Student.find({
      currentStatus: status,
    }).populate("session_info");

    if (!students) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "No applications found"));
    }

    const studentList = students.map((student) => {
      return {
        _id: student._id,
        flisId: student._id,
        name: `${student.student_details.first_name} ${student.student_details.last_name}`,
        gender: student.student_details.gender,
        photo: student.student_details.student_photo,
        date_of_birth: student.student_details.date_of_birth,
        admission_id: student.applicationId,
        academic_era: student.session_info?.name,
      };
    });

    return res
      .status(200)
      .json(
        new ApiRes(200, studentList, "Applications list fetched successfully.")
      );
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getStudentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing student ID"));
  }

  try {
    let student = await Student.findById(id)
      .populate({
        path: "class_info",
        select: "name",
      })
      .populate({
        path: "section_info",
        select: "name",
      })
      .populate({
        path: "session_info",
        select: "name",
      });

    if (!student) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Student not found with this ID"));
    }

    const feesStructure = await StudentFees.findOne({ student: id }).select(
      "fees"
    );

    student = { ...student._doc, fees: feesStructure?.fees };
    return res
      .status(200)
      .json(new ApiRes(200, student, "Student details fetched successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export {
  getCurrentStatus,
  createStudent,
  handleCreateOrUpdateStudent,
  handleCreateStudent,
  getStudentsByStatus,
  getStudentDetails,
};
