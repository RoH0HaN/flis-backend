import { Document } from "../models/document.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { uploadPdfToFirebase } from "../utils/upload.pdf.firebase.js";
import { deleteFromFirebase } from "../utils/delete.from.firebase.js";
import { Logger } from "../utils/logger.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Student } from "../models/student.model.js";
import { StudentFees } from "../models/student.fees.model.js";
import { generateAgreement } from "../utils/pdf/generate.agreement..js";
import { FeesMaster } from "../models/fees.model.js";

const createDocument = asyncHandler(async (req, res) => {
  const { student, documentType, description } = req.body;

  // Check if `student` is valid
  if (!student || !mongoose.isValidObjectId(student)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing student ID"));
  }

  if (validateFields(req.body, ["documentType", "description"], res) !== true) {
    return;
  }

  try {
    const document = await Document.findOne({
      student: student,
      documentType: documentType,
    });

    if (document) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Document already exists"));
    }

    const documentUrl = await uploadPdfToFirebase(
      req.file.path,
      "documents",
      student,
      documentType
    );

    const newDocument = new Document({
      student,
      documentType,
      fileUrl: documentUrl,
      description,
    });

    await newDocument.save();

    return res
      .status(201)
      .json(new ApiRes(200, null, "Document created successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getStudentDocuments = asyncHandler(async (req, res) => {
  const { student } = req.params;

  if (!student || !mongoose.isValidObjectId(student)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing student ID"));
  }
  try {
    const documents = await Document.find({ student }).select(
      "-__v -createdAt -updatedAt"
    );

    if (!documents || documents.length === 0) {
      return res.status(404).json(new ApiRes(404, null, "Documents not found"));
    }
    return res
      .status(200)
      .json(new ApiRes(201, documents, "Documents fetched successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const generateAgreementPdf = asyncHandler(async (req, res) => {
  const { feesStructureId } = req.params;

  if (!feesStructureId || !mongoose.isValidObjectId(feesStructureId)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing fees structure ID"));
  }
  try {
    const feeStructure = await StudentFees.findById(feesStructureId)
      .select("student class session fees feesMaster")
      .populate("student class session");

    if (!feeStructure) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fee structure not found"));
    }

    const feesMaster = await FeesMaster.findById(feeStructure.feesMaster)
      .select("group")
      .populate("group");

    const studentInfo = {
      studentName:
        feeStructure.student.student_details.first_name +
        " " +
        feeStructure.student.student_details.last_name,
      fatherName:
        feeStructure.student.parent_guardian_details.father_information.name,
      motherName:
        feeStructure.student.parent_guardian_details.mother_information.name,
      dob: new Date(
        feeStructure.student.student_details.date_of_birth
      ).toLocaleDateString(),
      grade: feeStructure.student.student_details.class,
      academicYear: feeStructure.session.name,
    };

    const guardianInfo = {
      guardianName:
        feeStructure.student.parent_guardian_details.guardian_information.name,
      address:
        feeStructure.student.communication_address.current_address.village +
        ", " +
        feeStructure.student.communication_address.current_address.district +
        ", " +
        feeStructure.student.communication_address.current_address.state +
        ", " +
        feeStructure.student.communication_address.current_address.postal_code,
    };

    const feesInfo = feeStructure.fees;
    const feesGroupName = feesMaster.group.name;
    const boardingStatus = feeStructure.student.boardingStatus;

    generateAgreement(
      res,
      studentInfo,
      guardianInfo,
      feesInfo,
      feesGroupName,
      boardingStatus
    );
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing document ID"));
  }

  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json(new ApiRes(404, null, "Document not found"));
    }
    const deleted = await deleteFromFirebase(document.fileUrl);

    if (!deleted) {
      return res
        .status(404)
        .json(
          new ApiRes(
            404,
            null,
            "Something went wrong while deleting file from Firebase"
          )
        );
    }

    const deletedDocument = await Document.findByIdAndDelete(id);

    if (!deletedDocument) {
      return res
        .status(404)
        .json(
          new ApiRes(
            404,
            null,
            "Something went wrong while deleting document from database"
          )
        );
    }

    return res
      .status(200)
      .json(new ApiRes(200, null, "Document deleted successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export {
  createDocument,
  deleteDocument,
  getStudentDocuments,
  generateAgreementPdf,
};
