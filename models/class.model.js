import { Schema, model } from "mongoose";

// Schema for Section
const sectionSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "A", "B"
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true }, // Reference to Class
    maxStudents: { type: Number, required: true }, // Max students allowed in the section
    totalStudents: { type: Number, default: 0 }, // Current number of enrolled students
  },
  { timestamps: true }
);

// Schema for Class
const classSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Class 4", "Class 10"
    sections: [{ type: Schema.Types.ObjectId, ref: "Section" }], // Array of Section references
    description: { type: String, default: "N/A" },
  },
  { timestamps: true }
);

// Create Models
export const Class = model("Class", classSchema);
export const Section = model("Section", sectionSchema);
