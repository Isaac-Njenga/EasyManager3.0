import mongoose from "mongoose";
import crypto from "node:crypto";

const expenseSchema = new mongoose.Schema(
  {
    expenseNumber: { type: String, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Rent & Utilities",
        "Salaries & Wages",
        "Inventory & Supplies",
        "Marketing & Ads",
        "Transport & Logistics",
        "Maintenance & Repairs",
        "Licenses & Taxes",
        "Miscellaneous",
      ],
    },
    amount: { type: Number, required: true },
    dateOfExpense: { type: String, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Credit Card", "M-Pesa", "Bank Transfer"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Paid", "Pending", "Overdue"],
    },
    payee: { type: String, required: false },
    notes: { type: String, required: false },
  },
  { collection: "expenses", timestamps: true },
);

function generateExpenseNumber(): string {
  const namePrefix = "EXP";
  const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${namePrefix}-${randomSuffix}`;
}

expenseSchema.pre("save", async function () {
  if (!this.expenseNumber) {
    let isUnique = false;
    let candidateNumber = "";
    let attempts = 0;
    const maxAttempts = 10;

    // Retry loop to ensure uniqueness
    while (!isUnique && attempts < maxAttempts) {
      candidateNumber = generateExpenseNumber();

      // Check MongoDB if candidateNumber exists
      const existingExpense = await mongoose.models.Sale.findOne({
        expenseNumber: candidateNumber,
      });

      if (!existingExpense) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error(
        "Failed to generate a unique receipt number after multiple attempts.",
      );
    }

    this.expenseNumber = candidateNumber;
  }
});

export const ExpenseModel = mongoose.model("Expense", expenseSchema);
