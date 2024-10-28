import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
  {
    year: { type: String, required: true }, // e.g., "2024-2025"
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // To mark the current active session
  },
  { timestamps: true }
);

export const Session = model("Session", sessionSchema);
