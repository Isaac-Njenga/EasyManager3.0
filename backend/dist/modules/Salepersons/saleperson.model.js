"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalespersonModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const performanceSchema = new mongoose_1.default.Schema({
    totalSales: { type: Number, default: 0 },
    totalRevenueGenerated: { type: Number, default: 0 },
    totalCommissionEarned: { type: Number, default: 0 },
}, { _id: false });
const salepersonSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive", "Terminated"],
        default: "Active",
    },
    assignedShop: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    totalCommission: { type: Number, default: 0 },
    performanceSummary: { type: performanceSchema, default: {} },
    hireDate: { type: Date, required: true },
}, { collection: "salepersons", timestamps: true });
exports.SalespersonModel = mongoose_1.default.model("Saleperson", salepersonSchema);
//# sourceMappingURL=saleperson.model.js.map