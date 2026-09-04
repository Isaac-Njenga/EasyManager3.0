"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRouter = TransferRouter;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const transfer_controller_1 = require("./transfer.controller");
function TransferRouter() {
    const router = (0, express_1.Router)();
    router.post("/create-transfer", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, transfer_controller_1.createTransfer);
    router.get("/get-transfers", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, transfer_controller_1.fetchTransfers);
    router.get("/get-transfer/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, transfer_controller_1.fetchTransferById);
    router.put("/update-transfer/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, transfer_controller_1.updateTransfer);
    router.delete("/delete-transfer/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, transfer_controller_1.deleteTransfer);
    return router;
}
//# sourceMappingURL=transfer.routes.js.map