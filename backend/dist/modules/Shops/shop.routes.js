"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRouter = ShopRouter;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const shop_controller_1 = require("./shop.controller");
function ShopRouter() {
    const router = (0, express_1.Router)();
    router.post("/create-shop", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, shop_controller_1.createShop);
    router.get("/get-shops", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, shop_controller_1.fetchShops);
    router.get("/get-shop/:id", auth_middleware_1.protectRoute, shop_controller_1.fetchShopById);
    router.put("/update-shop/:id", auth_middleware_1.protectRoute, shop_controller_1.updateShop);
    router.delete("/delete-shop/:id", auth_middleware_1.protectRoute, shop_controller_1.deleteShop);
    return router;
}
//# sourceMappingURL=shop.routes.js.map