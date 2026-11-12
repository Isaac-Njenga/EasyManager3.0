"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const strict_1 = __importDefault(require("node:assert/strict"));
const access_policy_1 = require("../middleware/access-policy");
const user_model_1 = require("../modules/Users/user.model");
const otp_model_1 = require("../modules/OTP/otp.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const originalFindById = user_model_1.UserModel.findById;
const originalFindOne = user_model_1.UserModel.findOne;
const originalOtpFind = otp_model_1.OtpModel.findOne;
(0, node_test_1.afterEach)(() => {
    user_model_1.UserModel.findById = originalFindById;
    user_model_1.UserModel.findOne = originalFindOne;
    otp_model_1.OtpModel.findOne = originalOtpFind;
});
function invoke(middleware, req) {
    return new Promise((resolve, reject) => middleware(req, {}, (error) => (error ? reject(error) : resolve())));
}
async function configuration() {
    var _a;
    for (const key of [
        "URI",
        "JWT_SECRET",
        "EMAIL_HOST",
        "EMAIL_USER",
        "EMAIL_PASS",
        "REDIS_URL",
        "FRONTEND_URL",
        "WEBSITE_URL",
        "DEPLOYED_WEBSITE_URL",
        "GEMINI_API_KEY",
        "PROJECT_NUMBER",
        "PROJECT_NAME",
        "NAME",
        "COHERE_API_KEY",
    ])
        (_a = process.env)[key] ?? (_a[key] = "access-test-placeholder");
    return (await Promise.resolve().then(() => __importStar(require("../config/env")))).env;
}
(0, node_test_1.test)("audit can read admin resources, but cannot use any write method", () => {
    for (const method of ["GET", "HEAD", "OPTIONS"]) {
        strict_1.default.doesNotThrow(() => (0, access_policy_1.assertAuditReadOnly)("AUDIT", method));
        strict_1.default.equal((0, access_policy_1.canAccessAdminRoute)("AUDIT", method), true);
    }
    for (const method of ["POST", "PUT", "PATCH", "DELETE", "TRACE", "CONNECT"]) {
        strict_1.default.throws(() => (0, access_policy_1.assertAuditReadOnly)("AUDIT", method), {
            statusCode: 403,
        });
        strict_1.default.equal((0, access_policy_1.canAccessAdminRoute)("AUDIT", method), false);
    }
    strict_1.default.equal((0, access_policy_1.canAccessAdminRoute)("SUPER_ADMIN", "POST"), true);
    strict_1.default.equal((0, access_policy_1.canAccessAdminRoute)("SALESPERSON", "GET"), false);
    strict_1.default.throws(() => (0, access_policy_1.assertNotAuditAccount)("AUDIT"), { statusCode: 403 });
});
(0, node_test_1.test)("global guard rejects audit writes across every module, using the database role", async () => {
    const env = await configuration();
    const { restrictAuditWrites } = await Promise.resolve().then(() => __importStar(require("../middleware/auth.middleware")));
    const token = jsonwebtoken_1.default.sign({ userId: "3001", role: "SUPER_ADMIN" }, env.JWT_SECRET);
    user_model_1.UserModel.findById = (() => ({
        select: async () => ({ role: "AUDIT", isActivated: true }),
    }));
    for (const path of [
        "/sale/create-sale",
        "/user/update-user/3001",
        "/shop/add-products/1",
        "/transfer/create-transfer",
        "/catalog/create-catalog-product",
        "/cohere-model/generate-description",
        "/gemini-model/generate-description",
        "/auth/sign-up",
        "/auth/change-password",
        "/auth/password-reset/reset",
        "/future-module/action",
    ]) {
        await strict_1.default.rejects(invoke(restrictAuditWrites, {
            method: "POST",
            path,
            header: () => `Bearer ${token}`,
        }), { statusCode: 403 });
    }
    await invoke(restrictAuditWrites, {
        method: "POST",
        path: "/auth/sign-in",
        header: () => undefined,
    });
});
(0, node_test_1.test)("protected reads and admin reads allow audit, while direct protected mutations fail", async () => {
    await configuration();
    const { protectRoute } = await Promise.resolve().then(() => __importStar(require("../middleware/auth.middleware")));
    const { adminRoute } = await Promise.resolve().then(() => __importStar(require("../middleware/admin.middleware")));
    for (const method of ["GET", "HEAD", "OPTIONS"]) {
        await invoke(protectRoute, { method, user: { role: "AUDIT" } });
        await invoke(adminRoute, { method, user: { role: "AUDIT" } });
    }
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
        await strict_1.default.rejects(invoke(protectRoute, { method, user: { role: "AUDIT" } }), { statusCode: 403 });
        await strict_1.default.rejects(invoke(adminRoute, { method, user: { role: "AUDIT" } }), { statusCode: 403 });
    }
    await invoke(protectRoute, { method: "POST", user: { role: "SALESPERSON" } });
    await invoke(adminRoute, { method: "POST", user: { role: "SUPER_ADMIN" } });
});
(0, node_test_1.test)("disabled audit accounts and missing authentication cannot read protected resources", async () => {
    const env = await configuration();
    const { protectRoute } = await Promise.resolve().then(() => __importStar(require("../middleware/auth.middleware")));
    user_model_1.UserModel.findById = (() => ({
        select: async () => ({ role: "AUDIT", isActivated: false }),
    }));
    const token = jsonwebtoken_1.default.sign({ userId: "3001" }, env.JWT_SECRET);
    await strict_1.default.rejects(invoke(protectRoute, { method: "GET", header: () => `Bearer ${token}` }));
    await strict_1.default.rejects(invoke(protectRoute, { method: "GET", header: () => undefined }));
});
(0, node_test_1.test)("password changes and recovery cannot mutate audit accounts even without a bearer token", async () => {
    await configuration();
    const { changePassword, requestPasswordResetOtp, resetPassword } = await Promise.resolve().then(() => __importStar(require("../modules/Auth/auth.service")));
    const audit = {
        role: "AUDIT",
        password: "hashed",
        save: () => {
            throw new Error("Unexpected save");
        },
    };
    const query = Promise.resolve(audit);
    query.select = async () => audit;
    user_model_1.UserModel.findOne = (() => query);
    otp_model_1.OtpModel.findOne = (async () => ({ email: "audit@example.invalid" }));
    await strict_1.default.rejects(changePassword({
        userId: "3001",
        email: "audit@example.invalid",
        oldPassword: "old-password",
        newPassword: "new-password",
    }), { statusCode: 403 });
    await strict_1.default.rejects(requestPasswordResetOtp({ userId: "3001", email: "audit@example.invalid" }), { statusCode: 403 });
    await strict_1.default.rejects(resetPassword({
        userId: "3001",
        email: "audit@example.invalid",
        newPassword: "new-password",
    }), { statusCode: 403 });
});
(0, node_test_1.test)("audit user model validates as an activated account", async () => {
    await new user_model_1.UserModel({
        userId: "3001",
        password: "hashed",
        role: "AUDIT",
        isActivated: true,
    }).validate();
});
//# sourceMappingURL=access.test.js.map