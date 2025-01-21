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

const getFeesStructure = asyncHandler(async (req, res) => {
  const { studentId, sessionId, classId } = req.query;

  if (
    !studentId ||
    !mongoose.isValidObjectId(studentId) ||
    !sessionId ||
    !mongoose.isValidObjectId(sessionId) ||
    !classId ||
    !mongoose.isValidObjectId(classId)
  ) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing query parameters"));
  }

  try {
    const feesStructure = await StudentFees.findOne({
      student: studentId,
      session: sessionId,
      class: classId,
    }).select("-__v -createdAt -updatedAt");

    if (!feesStructure) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees structure not found"));
    }

    return res
      .status(200)
      .json(
        new ApiRes(200, feesStructure, "Fees structure fetched successfully")
      );
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const addPaymentHistory = asyncHandler(async (req, res) => {
  const { feesStructureId, feeId } = req.query;

  if (
    !feesStructureId ||
    !mongoose.isValidObjectId(feesStructureId) ||
    !feeId ||
    !mongoose.isValidObjectId(feeId)
  ) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing fees structure ID"));
  }

  const { amountPaid, paymentMethod, transactionId } = req.body;

  if (
    validateFields(
      req.body,
      ["amountPaid", "paymentMethod", "transactionId"],
      res
    ) !== true
  ) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing payment details"));
  }

  try {
    const feesStructure = await StudentFees.findById(feesStructureId);

    if (!feesStructure) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees structure not found"));
    }

    const fee = feesStructure.fees.id(feeId);

    if (!fee) {
      return res.status(404).json(new ApiRes(404, null, "Fee not found"));
    }

    const remainingAmount = fee.finalAmount - fee.paidAmount;

    // Check for overpayment
    if (amountPaid > remainingAmount) {
      return res
        .status(400)
        .json(
          new ApiRes(
            400,
            null,
            `Amount exceeds the remaining amount of ${remainingAmount}`
          )
        );
    }

    fee.paymentHistory.push({
      amountPaid,
      paymentMethod,
      transactionId,
    });

    // Update paidAmount and paymentStatus
    fee.paidAmount += amountPaid;
    fee.paymentStatus =
      fee.paidAmount >= fee.finalAmount
        ? "PAID"
        : fee.paidAmount > 0
          ? "PARTIALLY_PAID"
          : "UNPAID";

    await feesStructure.save();

    return res
      .status(200)
      .json(new ApiRes(200, null, "Payment record added successfully"));
  } catch (error) {}
});

export {
  createFeesStructure,
  handleCreateFees,
  getFeesStructure,
  addPaymentHistory,
};
