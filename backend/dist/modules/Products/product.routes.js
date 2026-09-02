"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = ProductRouter;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const product_controller_1 = require("./product.controller");
function ProductRouter() {
    const router = (0, express_1.Router)();
    router.post("/create-product", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, product_controller_1.createProduct);
    router.get("/get-products", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, product_controller_1.fetchProducts);
    router.get("/get-product/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, product_controller_1.fetchProductById);
    router.put("/update-product/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, product_controller_1.updateProduct);
    router.delete("/delete-product/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, product_controller_1.deleteProduct);
    return router;
}
//# sourceMappingURL=product.routes.js.map