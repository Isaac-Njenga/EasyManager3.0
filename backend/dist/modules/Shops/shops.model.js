"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const InventorySummarySchema = new mongoose_1.default.Schema({
    totalProducts: { type: Number, required: false, default: 0 },
    totalItemsInStock: { type: Number, required: false, default: 0 },
    totalStockValue: { type: Number, required: false, default: 0 },
    lowStockItemsCount: { type: Number, required: false, default: 0 },
}, { _id: false });
const InventoryItemSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true },
});
const shopSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive", "Under Maintenance"],
        default: "Active",
    },
    shopCode: { type: String, unique: true },
    type: { type: String, required: true, enum: ["Retail Store", "Showroom"] },
    address: {
        building: { type: String, required: true },
        town: { type: String, required: true },
    },
    inventorySummary: InventorySummarySchema,
    inventoryItems: [InventoryItemSchema],
    notes: { type: String, required: false },
}, { collection: "shops", timestamps: true });
// Code Generator Function
function generateShopCode(name = "") {
    const namePrefix = name ? name.substring(0, 3).toUpperCase() : "GEN";
    const randomSuffix = crypto_1.default.randomBytes(2).toString("hex").toUpperCase();
    return `SHP-${namePrefix}-${randomSuffix}`;
    // Option B: Pure sequential counter/hash if preferred
    // return `SHP-${Math.floor(100000 + Math.random() * 900000)}`;
}
// Pre-save hook to generate and verify unique shopCode
shopSchema.pre("save", async function () {
    // Only generate code if it hasn't been set yet or if this is a new document
    if (!this.shopCode) {
        let isUnique = false;
        let candidateCode = "";
        let attempts = 0;
        const maxAttempts = 10;
        // Retry loop to ensure uniqueness
        while (!isUnique && attempts < maxAttempts) {
            candidateCode = generateShopCode(this.name);
            // Check MongoDB if candidateCode exists
            const existingShop = await mongoose_1.default.models.Shop.findOne({
                shopCode: candidateCode,
            });
            if (!existingShop) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) {
            throw new Error("Failed to generate a unique shop code after multiple attempts.");
        }
        this.shopCode = candidateCode;
    }
});
exports.ShopModel = mongoose_1.default.model("Shop", shopSchema);
//# sourceMappingURL=shops.model.js.map