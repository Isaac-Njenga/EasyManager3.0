"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const InventorySummarySchema = new mongoose_1.default.Schema({
    totalProducts: { type: Number, required: false, default: 0 },
    totalItemsInStock: { type: Number, required: false, default: 0 },
    totalStockValue: { type: Number, required: false, default: 0 },
    lowStockItemsCount: { type: Number, required: false, default: 0 },
    outOfStockItemsCount: { type: Number, required: false, default: 0 },
}, { _id: false });
const InventoryItemSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true },
});
const warehouseSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive", "Under Maintenance", "Full Capacity"],
        default: "Active",
    },
    warehouseCode: { type: String, unique: true },
    address: {
        building: { type: String, required: true },
        city: { type: String, required: true },
    },
    inventorySummary: InventorySummarySchema,
    inventoryItems: [InventoryItemSchema],
    notes: { type: String, required: false },
}, { collection: "warehouses", timestamps: true });
function generateWarehouseCode(name = "") {
    const namePrefix = name ? name.substring(0, 3).toUpperCase() : "GEN";
    const randomSuffix = node_crypto_1.default.randomBytes(2).toString("hex").toUpperCase();
    return `WH-${namePrefix}-${randomSuffix}`;
    // Option B: Pure sequential counter/hash if preferred
    // return `WH-${Math.floor(100000 + Math.random() * 900000)}`;
}
// Pre-save hook to generate and verify unique warehouseCode
warehouseSchema.pre("save", async function () {
    // Only generate code if it hasn't been set yet or if this is a new document
    if (!this.warehouseCode) {
        let isUnique = false;
        let candidateCode = "";
        let attempts = 0;
        const maxAttempts = 10;
        // Retry loop to ensure uniqueness
        while (!isUnique && attempts < maxAttempts) {
            candidateCode = generateWarehouseCode(this.name);
            // Check MongoDB if candidateCode exists
            const existingWarehouse = await mongoose_1.default.models.Warehouse.findOne({
                warehouseCode: candidateCode,
            });
            if (!existingWarehouse) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) {
            throw new Error("Failed to generate a unique warehouse code after multiple attempts.");
        }
        this.warehouseCode = candidateCode;
    }
});
exports.WarehouseModel = mongoose_1.default.model("Warehouse", warehouseSchema);
//# sourceMappingURL=warehouse.model.js.map