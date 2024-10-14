import { Schema, model } from "mongoose";

const feesHeader = new Schema(
  {
    name: { type: String, required: true },
    feesCode: { type: String, required: true },
    occurance: { type: String, required: true },
    dueDate: { type: String, required: true },
    description: { type: String, default: "N/A" },
  },
  { timestamps: true }
);

const feesGroupSchema = new Schema(
  {
    name: { type: String, required: true },
    groupCode: { type: String, required: true },
    description: { type: String, default: "N/A" },
  },
  { timestamps: true }
);

const feesMasterSchema = new Schema(
  {
    group: { type: Schema.Types.ObjectId, ref: "FeesGroup", required: true },
    headers: {
      type: [
        {
          header: {
            type: Schema.Types.ObjectId,
            ref: "FeesHeader",
            required: true,
          },
          amount: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const FeesHeader = model("FeesHeader", feesHeader);
export const FeesGroup = model("FeesGroup", feesGroupSchema);
export const FeesMaster = model("FeesMaster", feesMasterSchema);
