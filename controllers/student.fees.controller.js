import { FeesMaster } from "../models/fees.model.js";
import { StudentFees } from "../models/student.fees.model.js";
import { Student } from "../models/student.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";
import mongoose from "mongoose";

const handleCreateFees = async ({
  studentId,
  fees_info,
  class_info,
  session_info,
}) => {
  if (!studentId || !mongoose.isValidObjectId(studentId)) {
    return {
      feeMassage: "Student ID is required",
    };
  }
  // console.log(studentId, fees_info, class_info, session_info);

  try {
    let returnId = "";
    for (const item of fees_info) {
      const feesMaster = await FeesMaster.findOne({
        group: item,
      }).populate({
        path: "headers.header",
      });

      if (!feesMaster) return;

      const studentFees = await StudentFees.findOne({
        student: studentId,
        feesMaster: feesMaster._id,
      });

      if (studentFees) {
        returnId = studentFees._id;
        continue;
      }

      const newFeesStructure = new StudentFees({
        student: studentId,
        session: session_info,
        class: class_info,
        feesMaster: feesMaster._id,
        fees: feesMaster.headers.map((item) => ({
          name: item.header.name,
          feesCode: item.header.feesCode,
          occurrence: item.header.occurrence,
          amount: item.amount,
          discountAmount: 0,
          finalAmount: item.amount,
          dueDate: item.header.dueDate,
          paidAmount: 0,
        })),
        totalFinalAmount: feesMaster.headers.reduce(
          (sum, item) => sum + item.amount,
          0
        ),
      });

      await newFeesStructure.save();
      returnId = newFeesStructure._id;
    }
    return { feesStructureId: returnId };
  } catch (error) {
    return "";
  }
};

const createFeesStructure = asyncHandler(async (req, res) => {
  const { student, feesMaster } = req.body;

  if (validateFields(req.body, ["student", "feesMaster"], res) !== true) {
    return;
  }
  if (
    !mongoose.isValidObjectId(student) ||
    !mongoose.isValidObjectId(feesMaster)
  ) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid student or Fees Master ID"));
  }

  try {
    const student = Student.findById(student);
    if (!student) {
      return res.status(404).json(new ApiRes(404, null, "Student not found"));
    }

    const feesMasterDetails = await FeesMaster.findById(feesMaster).populate({
      path: "headers.header",
    });
    if (!feesMasterDetails) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees Master not found"));
    }

    const newFeesStructure = new StudentFees({
      student: student._id,
      session: student.session,
      class: student.class_info,
      feesMaster: feesMaster._id,
      fees: feesMasterDetails.headers.map((item) => ({
        name: item.name,
        feesCode: item.feesCode,
        occurrence: item.occurrence,
        amount: item.amount,
        discountAmount: 0,
        finalAmount: item.amount,
        dueDate: item.dueDate,
        paidAmount: 0,
      })),
      totalFinalAmount: feesMasterDetails.headers.reduce(
        (sum, item) => sum + item.amount,
        0
      ),
    });
    await newFeesStructure.save();

    return res
      .status(200)
      .json(new ApiRes(200, null, "Fees structure created"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export { createFeesStructure, handleCreateFees };
