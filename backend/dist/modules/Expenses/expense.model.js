"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const expenseSchema = new mongoose_1.default.Schema({
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
}, { collection: "expenses", timestamps: true });
function generateExpenseNumber() {
    const namePrefix = "EXP";
    const randomSuffix = node_crypto_1.default.randomBytes(2).toString("hex").toUpperCase();
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
            const existingExpense = await mongoose_1.default.models.Sale.findOne({
                expenseNumber: candidateNumber,
            });
            if (!existingExpense) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) {
            throw new Error("Failed to generate a unique receipt number after multiple attempts.");
        }
        this.expenseNumber = candidateNumber;
    }
});
exports.ExpenseModel = mongoose_1.default.model("Expense", expenseSchema);
//# sourceMappingURL=expense.model.js.map