import { Document } from "../models/document.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { uploadPdfToFirebase } from "../utils/upload.pdf.firebase.js";
import { deleteFromFirebase } from "../utils/delete.from.firebase.js";
import { Logger } from "../utils/logger.js";
import mongoose from "mongoose";
import { Student } from "../models/student.model.js";

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

const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing document ID"));
  }
  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json(new ApiRes(404, null, "Document not found"));
    }
    await deleteFromFirebase(document.fileUrl);
    await Document.findByIdAndDelete(id);
    return res
      .status(200)
      .json(new ApiRes(200, null, "Document deleted successfully"));
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

export { createDocument, deleteDocument, getStudentDocuments };
