const studentFeesSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },

    // Monthly fee breakdown
    monthlyFees: [
      {
        month: { type: String, required: true }, // e.g., "January", "February"
        baseAmount: { type: Number, required: true }, // Original amount due for this month
        discountAmount: { type: Number, default: 0 }, // Any discount applied this month
        finalAmount: { type: Number, required: true }, // After discount: baseAmount - discountAmount

        paidAmount: { type: Number, default: 0 }, // Track payments for this month
        dueAmount: {
          type: Number,
          default: function () {
            return this.finalAmount;
          },
        }, // Tracks remaining due

        paymentStatus: {
          type: String,
          enum: ["PAID", "PARTIALLY_PAID", "UNPAID"],
          default: "UNPAID",
        },

        dueDate: { type: Date, required: true }, // Due date for this month's fee

        // Payment history for this specific month
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

    // Total amounts for all months combined
    totalBaseAmount: { type: Number, required: true },
    totalDiscountAmount: { type: Number, default: 0 },
    totalFinalAmount: { type: Number, required: true }, // After all discounts

    totalPaidAmount: { type: Number, default: 0 },
    totalDueAmount: {
      type: Number,
      default: function () {
        return this.totalFinalAmount;
      },
    }, // Overall due amount

    overallPaymentStatus: {
      type: String,
      enum: ["PAID", "PARTIALLY_PAID", "UNPAID"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

export const StudentFees = model("StudentFees", studentFeesSchema);
