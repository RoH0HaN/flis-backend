import { Schema, model } from "mongoose";

const StudentFeesSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    feesMaster: {
      type: Schema.Types.ObjectId,
      ref: "FeesMaster",
      required: true,
    },

    fees: {
      type: [
        {
          name: { type: String, required: true },
          feesCode: { type: String, required: true },
          occurrence: { type: String, required: true },
          amount: { type: Number, required: true },
          discountAmount: { type: Number, default: 0 },
          finalAmount: { type: Number, required: true },
          dueDate: { type: Date, required: true },
          paidAmount: { type: Number, default: 0 },

          paymentStatus: {
            type: String,
            enum: ["PAID", "PARTIALLY_PAID", "UNPAID"],
            default: "UNPAID",
          },
          paymentHistory: [
            {
              amountPaid: { type: Number, required: true },
              paymentDate: { type: Date, default: Date.now },
              paymentMethod: {
                type: String,
                enum: ["CASH", "CARD", "ONLINE"],
                default: "CASH",
              },
              transactionId: { type: String },
            },
          ],
        },
      ],
    },
    totalFinalAmount: { type: Number, required: true },
    totalPaidAmount: { type: Number, default: 0 },

    overallPaymentStatus: {
      type: String,
      enum: ["PAID", "PARTIALLY_PAID", "UNPAID"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

// Middleware to calculate totalPaidAmount, overallPaymentStatus
StudentFeesSchema.pre("save", function (next) {
  this.totalPaidAmount = this.fees.reduce(
    (sum, fee) => sum + fee.paidAmount,
    0
  );
  this.overallPaymentStatus =
    this.totalPaidAmount >= this.totalFinalAmount
      ? "PAID"
      : this.totalPaidAmount > 0
        ? "PARTIALLY_PAID"
        : "UNPAID";
  next();
});

export const StudentFees = model("StudentFees", StudentFeesSchema);
