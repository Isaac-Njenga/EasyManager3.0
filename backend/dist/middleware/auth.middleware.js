"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictAuditWrites = exports.protectRoute = void 0;
exports.authenticateRequest = authenticateRequest;
const access_policy_1 = require("./access-policy");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const BadRequestError_1 = require("../common/errors/BadRequestError");
const catchAsync_1 = require("../common/utils/catchAsync");
const user_model_1 = require("../modules/Users/user.model");
async function authenticateRequest(req) {
    if (req.user)
        return;
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
        throw new BadRequestError_1.BadRequestError("No token provided. Access denied!");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (!decoded || typeof decoded === "string" || !decoded.userId)
            throw new Error("Invalid token");
        const user = await user_model_1.UserModel.findById(decoded.userId).select("-password -refreshToken");
        if (!user || !user.isActivated)
            throw new Error("Account is unavailable");
        req.user = user;
    }
    catch {
        throw new BadRequestError_1.BadRequestError("Invalid token. Access denied!");
    }
}
exports.protectRoute = (0, catchAsync_1.catchAsync)(async (req, _res, next) => {
    await authenticateRequest(req);
    (0, access_policy_1.assertAuditReadOnly)(req.user.role, req.method);
    next();
});
// Cover authenticated writes even on routes that do not use protectRoute.
exports.restrictAuditWrites = (0, catchAsync_1.catchAsync)(async (req, _res, next) => {
    if (!(0, access_policy_1.isReadMethod)(req.method) &&
        req.path !== "/auth/sign-in" &&
        req.header("Authorization")) {
        await authenticateRequest(req);
        (0, access_policy_1.assertAuditReadOnly)(req.user.role, req.method);
    }
    next();
});
//# sourceMappingURL=auth.middleware.js.map