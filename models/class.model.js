import { Schema, model } from "mongoose";

const classSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "Class 4", "Class 10"
    section: { type: String, required: true }, // e.g., "A", "B"
    description: { type: String, default: "N/A" },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    }, // Reference to session
  },
  { timestamps: true }
);
export const Class = model("Class", classSchema);
