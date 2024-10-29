import { Schema, model } from "mongoose";

// Document schema for storing document metadata
const documentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  documentType: { type: String, required: true }, // e.g., "ID Proof", "Report Card"
  fileUrl: { type: String, required: true }, // URL to where the document is stored (S3, Google Cloud, etc.)
  uploadDate: { type: Date, default: Date.now },
  description: { type: String }, // Optional, for additional info on the document
});

export const Document = model("Document", documentSchema);
