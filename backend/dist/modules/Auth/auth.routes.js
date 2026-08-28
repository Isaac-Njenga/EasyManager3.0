"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = AuthRouter;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
function AuthRouter() {
    const router = (0, express_1.Router)();
    router.post("/sign-up", auth_controller_1.userRegisterController);
    router.post("/activate-account", auth_controller_1.activateAccountController);
    router.post("/sign-in", auth_controller_1.userLoginController);
    router.post("/change-password", auth_controller_1.changePasswordController);
    //   router.post("/password-reset/request-otp", requestPasswordResetOtpController);
    //   router.post("/password-reset/verify-otp", verifyPasswordResetOtpController);
    //   router.post("/password-reset/reset", resetPasswordController);
    //   router.get("/check-username", checkUsernameExists);
    //   router.get("/check-email", checkEmailExists);
    return router;
}
//# sourceMappingURL=auth.routes.js.map