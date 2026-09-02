"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LocationStockSchema = new mongoose_1.default.Schema({
    locationType: {
        type: String,
        required: true,
        enum: ["Shop", "Warehouse"],
    },
    locationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity cannot be negative"],
        default: 0,
    },
}, { _id: false });
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    sku: {
        type: String,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    colour: {
        type: String,
        trim: true,
    },
    image: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    costPrice: {
        type: Number,
        required: true,
        min: [0, "Cost price cannot be negative"],
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: [0, "Selling price cannot be negative"],
    },
    totalQuantity: {
        type: Number,
        default: 0,
        min: 0,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    inventoryDistribution: {
        type: [LocationStockSchema],
        required: false,
        default: [],
    },
}, {
    collection: "products",
    timestamps: true,
});
productSchema.index({ code: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
exports.ProductModel = mongoose_1.default.model("Product", productSchema);
//# sourceMappingURL=product.model.js.map