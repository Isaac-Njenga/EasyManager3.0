"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleRouter = SaleRouter;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const sale_controller_1 = require("./sale.controller");
function SaleRouter() {
    const router = (0, express_1.Router)();
    router.post("/create-sale", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, sale_controller_1.createSale);
    router.get("/get-sales", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, sale_controller_1.fetchSales);
    router.get("/get-sale/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, sale_controller_1.fetchSaleById);
    router.put("/update-sale/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, sale_controller_1.updateSale);
    router.delete("/delete-sale/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, sale_controller_1.deleteSale);
    return router;
}
//# sourceMappingURL=sale.routes.js.map