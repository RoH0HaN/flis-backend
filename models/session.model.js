import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    isActive: { type: Boolean, default: false }, // To mark the current active session
  },
  { timestamps: true }
);

export const Session = model("Session", sessionSchema);
