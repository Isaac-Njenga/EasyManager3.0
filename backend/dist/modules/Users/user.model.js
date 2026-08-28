"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    firstname: { type: String, trim: true, default: "" },
    lastname: { type: String, trim: true, default: "" },
    userId: {
        type: String,
        trim: true,
        sparse: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: { type: String, default: null },
    role: {
        type: String,
        enum: ["SUPER_ADMIN", "SALESPERSON"],
        required: true,
        default: "SALESPERSON",
    },
    isActivated: { type: Boolean, default: false },
    refreshToken: {
        type: String,
        default: null,
        select: false,
    },
}, {
    collection: "users",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
UserSchema.index({ role: 1 });
UserSchema.index({ isActivated: 1 });
exports.UserModel = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=user.model.js.map