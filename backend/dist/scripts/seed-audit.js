"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/Users/user.model");
async function main() {
    if (!process.env.URI)
        throw new Error("URI is required");
    await mongoose_1.default.connect(process.env.URI, {
        autoIndex: false,
        autoCreate: false,
        serverSelectionTimeoutMS: 10000,
    });
    try {
        const existing = await user_model_1.UserModel.findOne({ userId: "3001" });
        if (existing && existing.role !== "AUDIT")
            throw new Error("User ID 3001 is already assigned to another role; no account was changed.");
        const password = await bcryptjs_1.default.hash("Audit3001", 10);
        const user = await user_model_1.UserModel.findOneAndUpdate({ userId: "3001", role: "AUDIT" }, {
            $set: {
                password,
                role: "AUDIT",
                isActivated: true,
                refreshToken: null,
            },
            $setOnInsert: {
                userId: "3001",
                firstname: "Audit",
                lastname: "User",
                avatar: null,
            },
        }, { upsert: true, new: true, runValidators: true });
        console.log(JSON.stringify({
            userId: user.userId,
            role: user.role,
            isActivated: user.isActivated,
        }));
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
main().catch((error) => {
    console.error(error instanceof Error ? error.message : "Audit seed failed");
    process.exitCode = 1;
});
//# sourceMappingURL=seed-audit.js.map