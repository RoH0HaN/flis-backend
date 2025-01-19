import { Schema, model } from "mongoose";

const healthRecordSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    records: {
      type: Schema.Types.Array,
      default: [],
    },
  },
  { timestamps: true }
);

export const HealthRecord = model("HealthRecord", healthRecordSchema);
