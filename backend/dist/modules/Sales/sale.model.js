"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const customerSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
});
const saleItemSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true, default: 0 },
    soldPrice: { type: Number, required: true, min: 0 },
    shop: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Shop", required: true },
    netProfit: { type: Number, required: false, default: 0 },
    netLoss: { type: Number, required: false, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    subTotal: { type: Number, required: true, default: 0 },
});
const saleSchema = new mongoose_1.default.Schema({
    receiptNumber: { type: String, unique: true },
    customer: { type: customerSchema, required: false },
    items: { type: [saleItemSchema], required: true },
    subTotal: { type: Number, required: true, default: 0 },
    discountTotal: { type: Number, required: true, default: 0 },
    dateOfSale: { type: String, required: true },
    grandTotal: { type: Number, required: true, default: 0 },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Cash", "Credit Card", "M-Pesa", "Bank Transfer"],
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["Paid", "Pending", "Partially Paid"],
    },
    status: {
        type: String,
        required: true,
        enum: ["Processing", "Completed", "Cancelled", "Returned"],
    },
    saleperson: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Saleperson",
        required: true,
    },
    commission: { type: Number, required: true, default: 0 },
    notes: { type: String, required: false },
}, { collection: "sales", timestamps: true });
function generateReceiptNumber() {
    const namePrefix = "REC";
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = node_crypto_1.default.randomBytes(2).toString("hex").toUpperCase();
    return `${namePrefix}-${currentDate}-${randomSuffix}`;
    // Option B: Pure sequential counter/hash if preferred
    // return `REC-${Math.floor(100000 + Math.random() * 900000)}`;
}
saleSchema.pre("save", async function () {
    if (!this.receiptNumber) {
        let isUnique = false;
        let candidateNumber = "";
        let attempts = 0;
        const maxAttempts = 10;
        // Retry loop to ensure uniqueness
        while (!isUnique && attempts < maxAttempts) {
            candidateNumber = generateReceiptNumber();
            // Check MongoDB if candidateNumber exists
            const existingReceipt = await mongoose_1.default.models.Sale.findOne({
                receiptNumber: candidateNumber,
            });
            if (!existingReceipt) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) {
            throw new Error("Failed to generate a unique receipt number after multiple attempts.");
        }
        this.receiptNumber = candidateNumber;
    }
});
exports.SaleModel = mongoose_1.default.model("Sale", saleSchema);
//# sourceMappingURL=sale.model.js.map