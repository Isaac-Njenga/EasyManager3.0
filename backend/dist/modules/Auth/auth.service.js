"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.login = exports.activateAccountService = exports.createAccount = void 0;
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const activateAccount_1 = require("../../utils/activateAccount");
const generateToken_1 = require("../../utils/generateToken");
// import { otpRequest } from "../../utils/requestOTP";
// import { verifyOtpCode } from "../../utils/VerifyOTP";
// import { OtpModel } from "../OTP/otp.model";
const user_model_1 = require("../Users/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createAccount = async (input) => {
    if (!input.userId) {
        throw new BadRequestError_1.BadRequestError("UserId is required");
    }
    if (!input.password) {
        throw new BadRequestError_1.BadRequestError("Password is required");
    }
    if (input.password.length < 8) {
        throw new BadRequestError_1.BadRequestError("Password must be at least 8 characters long");
    }
    const existingUserId = await user_model_1.UserModel.findOne({
        userId: input.userId,
    });
    if (existingUserId) {
        throw new BadRequestError_1.BadRequestError("User with this user ID already exists");
    }
    const passwordHash = await bcryptjs_1.default.hash(input.password, 10);
    const defaultAvatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${input.userId}`;
    return {
        ...input,
        password: passwordHash,
        avatar: defaultAvatarUrl,
    };
};
exports.createAccount = createAccount;
const activateAccountService = async (userId) => {
    if (!userId) {
        throw new BadRequestError_1.BadRequestError("User ID is required");
    }
    await (0, activateAccount_1.activateAccount)(userId);
    return true;
};
exports.activateAccountService = activateAccountService;
const login = async (input) => {
    if (!input.userId) {
        throw new BadRequestError_1.BadRequestError("User ID is required");
    }
    if (!input.password) {
        throw new BadRequestError_1.BadRequestError("Password is required");
    }
    const userId = input.userId;
    const user = await user_model_1.UserModel.findOne({ userId }).select("+password");
    if (!user) {
        throw new BadRequestError_1.BadRequestError("Invalid User ID or password");
    }
    if (!user.isActivated) {
        throw new BadRequestError_1.BadRequestError("Account is not activated. Please check your email for activation instructions.");
    }
    const isPasswordValid = await bcryptjs_1.default.compare(input.password, user.password);
    if (!isPasswordValid) {
        throw new BadRequestError_1.BadRequestError("Invalid email or password");
    }
    const { accessToken, refreshToken } = (0, generateToken_1.generateTokens)(user._id.toString());
    return { accessToken, refreshToken };
};
exports.login = login;
const changePassword = async (input) => {
    if (!input.oldPassword) {
        throw new BadRequestError_1.BadRequestError("Old password is required");
    }
    if (!input.newPassword) {
        throw new BadRequestError_1.BadRequestError("New password is required");
    }
    if (input.newPassword.length < 8) {
        throw new BadRequestError_1.BadRequestError("New password must be at least 8 characters long");
    }
    if (!input.userId) {
        throw new BadRequestError_1.BadRequestError("User ID is required");
    }
    const userId = input.userId;
    const user = await user_model_1.UserModel.findOne({ userId }).select("+password");
    if (!user) {
        throw new BadRequestError_1.BadRequestError("User not found");
    }
    const isOldPasswordValid = await bcryptjs_1.default.compare(input.oldPassword, user.password);
    if (!isOldPasswordValid) {
        throw new BadRequestError_1.BadRequestError("Invalid old password");
    }
    const isSamePassword = await bcryptjs_1.default.compare(input.newPassword, user.password);
    if (isSamePassword) {
        throw new BadRequestError_1.BadRequestError("New password must be different from the old password");
    }
    const newPasswordHash = await bcryptjs_1.default.hash(input.newPassword, 10);
    user.password = newPasswordHash;
    await user.save();
    return true;
};
exports.changePassword = changePassword;
// export const requestPasswordResetOtp = async (
//   input: RequestPasswordResetDTO,
// ): Promise<boolean> => {
//   if (!input.email) {
//     throw new BadRequestError("Email is required");
//   }
//     if (!input.userId) {
//     throw new BadRequestError("User ID is required");
//   }
//   const email = input.email.toLowerCase().trim();
//   const user = await UserModel.findOne({ userId:input.userId });
//   if (!user) {
//     throw new BadRequestError("User not found");
//   }
//   const isOtpSent = await otpRequest(email);
//   if (!isOtpSent) {
//     throw new BadRequestError("Failed to send OTP");
//   }
//   return true;
// };
// export const requestEmail = async (
//   input: RequestEmailDTO,
// ): Promise<{ email: string }> => {
//   if (!input.email) {
//     throw new BadRequestError("Email is required");
//   }
//     if (!input.userId) {
//     throw new BadRequestError("User ID is required");
//   }
//   const email = input.email.toLowerCase().trim();
//   const user = await UserModel.findOne({ userId:input.userId });
//   if (!user) {
//     throw new BadRequestError("User not found");
//   }
//   return { email };
// };
// export const verifyPasswordResetOtp = async (
//   input: Pick<VerifyOtpDTO, "email" | "otp">,
// ): Promise<boolean> => {
//   await requestEmail(input);
//   await verifyOtpCode(input.email, input.otp);
//   return true;
// };
// export const resetPassword = async (
//   input: ResetPasswordDTO,
// ): Promise<boolean> => {
//   if (!input.newPassword) {
//     throw new BadRequestError("New password is required");
//   }
//   if (input.newPassword.length < 8) {
//     throw new BadRequestError(
//       "New password must be at least 8 characters long",
//     );
//   }
//   if (!input.email) {
//     throw new BadRequestError("Email is required");
//   }
//   const { email } = await requestEmail(input);
//   const isOTPVerified = await OtpModel.findOne({ email: input.email });
//   if (!isOTPVerified) {
//     throw new BadRequestError("Invalid or expired OTP");
//   }
//   const user = await UserModel.findOne({ email });
//   if (!user) {
//     throw new BadRequestError("User not found");
//   }
//   const newPasswordHash = await bcrypt.hash(input.newPassword, 10);
//   user.password = newPasswordHash;
//   await user.save();
//   await OtpModel.deleteOne({ email });
//   return true;
// };
//# sourceMappingURL=auth.service.js.map