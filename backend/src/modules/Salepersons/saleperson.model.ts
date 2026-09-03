import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    totalSales: { type: Number, default: 0 },
    totalRevenueGenerated: { type: Number, default: 0 },
    totalCommissionEarned: { type: Number, default: 0 },
  },
  { _id: false },
);

const salepersonSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive", "Terminated"],
      default: "Active",
    },
    assignedShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    totalCommission: { type: Number, default: 0 },
    performanceSummary: { type: performanceSchema, default: {} },
    hireDate: { type: Date, required: true },
  },
  { collection: "salepersons", timestamps: true },
);

export const SalespersonModel = mongoose.model("Saleperson", salepersonSchema);
