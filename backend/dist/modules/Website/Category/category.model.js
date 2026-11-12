"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE",
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    collection: "categories",
    timestamps: true,
});
categorySchema.set("autoIndex", false);
categorySchema.index({ status: 1, sortOrder: 1 });
exports.CategoryModel = mongoose_1.default.model("Category", categorySchema);
//# sourceMappingURL=category.model.js.map