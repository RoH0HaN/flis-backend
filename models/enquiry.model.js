import { Schema, model } from "mongoose";

const enquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "RESOLVED"], default: "PENDING" },
  },
  { timestamps: true }
);

export const Enquiry = model("Enquiry", enquirySchema);
