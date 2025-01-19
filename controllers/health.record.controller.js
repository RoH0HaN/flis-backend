import { HealthRecord } from "../models/health.record.model.js";
import { Student } from "../models/student.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";
import mongoose, { isValidObjectId } from "mongoose";
import { uploadPdfToFirebase } from "../utils/upload.pdf.firebase.js";

const addHealthRecord = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;

  console.log(req.file);

  if (!studentId || !isValidObjectId(studentId)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing student ID"));
  }

  try {
    let recordDocument = await HealthRecord.findOne({ studentId });

    const student = await Student.findById(studentId).select("other_details");

    if (!student) {
      return res.status(404).json(new ApiRes(404, null, "Student not found"));
    }

    const data = JSON.parse(req.body.medical_details);

    const dietChartUrl = await uploadPdfToFirebase(
      req.file.path,
      "dietcharts",
      studentId,
      "dietchart"
    );

    const medical_details = {
      ...student.other_details.medical_details.toObject(),
      ...data,
    };

    recordDocument.records.push({
      medical_details,
      createdAt: new Date(),
      dietChartUrl,
    });

    student.other_details.medical_details = medical_details;

    await recordDocument.save();
    await student.save();

    return res
      .status(200)
      .json(
        new ApiRes(200, recordDocument, "Health record created successfully")
      );
  } catch (error) {
    console.log(error);

    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export { addHealthRecord };
