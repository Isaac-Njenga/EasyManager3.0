"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebProductRouter = WebProductRouter;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const website_controller_1 = require("./website.controller");
function WebProductRouter() {
    const router = (0, express_1.Router)();
    router.post("/create-web-product", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, website_controller_1.createProduct);
    router.get("/get-web-products", website_controller_1.fetchProducts);
    router.get("/get-web-product/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, website_controller_1.fetchProductById);
    router.put("/update-web-product/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, website_controller_1.updateProduct);
    router.delete("/delete-web-product/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, website_controller_1.deleteProduct);
    return router;
}
//# sourceMappingURL=website.routes.js.map