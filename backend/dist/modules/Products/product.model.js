"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: false },
    code: { type: String, required: true, unique: true },
    colour: { type: String, required: false },
    image: { type: [String], required: false, default: null },
    description: { type: String, required: false },
    category: { type: String, required: true },
    costPrice: { type: String, required: true },
    sellingPrice: { type: String, required: true },
    totalQuantity: { type: String, required: false },
    status: { type: String, required: true, enum: ["Active", "Inactive"], default: 'Active' },
    // inventory?: LocationStock[]; // will be done later after locations have been added
}, { collection: "products", timestamps: true });
exports.ProductModel = mongoose_1.default.model("Product", productSchema);
//# sourceMappingURL=product.model.js.map