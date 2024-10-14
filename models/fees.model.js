import { Schema, model } from "mongoose";

const feesHeader = new Schema(
  {
    name: { type: String, required: true },
    feesCode: { type: String, required: true },
    occurance: { type: String, required: true },
    dueDate: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: "N/A" },
  },
  { timestamps: true }
);

const feesGroupSchema = new Schema(
  {
    name: { type: String, required: true },
    feesHeaders: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "FeesHeader",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const FeesHeader = model("FeesHeader", feesHeader);
export const FeesGroup = model("FeesGroup", feesGroupSchema);
