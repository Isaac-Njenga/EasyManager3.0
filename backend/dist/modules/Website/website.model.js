"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const websiteSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
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
    colours: {
        type: [String],
        trim: true,
        default: [],
    },
    tags: {
        type: [String],
        trim: true,
        default: [],
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Cost price cannot be negative"],
    },
    discount: {
        type: Number,
        required: true,
        min: [0, "Cost price cannot be negative"],
        max: [100, "Discount cannot be more than 100%"],
    },
    isBestSeller: {
        type: Boolean,
        required: false,
        default: false,
        index: true,
    },
    isNewArrival: {
        type: Boolean,
        required: false,
        default: false,
        index: true,
    },
    inStock: {
        type: Boolean,
        required: false,
        default: false,
    },
}, { collection: "website", timestamps: true });
exports.WebsiteModel = mongoose_1.default.model("Website", websiteSchema);
//# sourceMappingURL=website.model.js.map