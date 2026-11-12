"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogProductRouter = CatalogProductRouter;
const express_1 = require("express");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const admin_middleware_1 = require("../../../middleware/admin.middleware");
const catalog_controller_1 = require("./catalog.controller");
function CatalogProductRouter() {
    const router = (0, express_1.Router)();
    router.post("/create-catalog-product", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, catalog_controller_1.createCatalog);
    router.get("/search", catalog_controller_1.searchProduct);
    router.get("/get-catalog-products", catalog_controller_1.fetchCatalogs);
    router.get("/get-all-catalog-products", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, catalog_controller_1.fetchAllCatalogs);
    router.get("/get-catalog-product/:slug", catalog_controller_1.fetchCatalogBySlug);
    router.get("/get-catalog-product-by-id/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, catalog_controller_1.fetchCatalogById);
    router.get("/get-featured-products", catalog_controller_1.fetchFeaturedCatalogs);
    router.get("/get-best-selling-product", catalog_controller_1.fetchBestSellingCatalogProducts);
    router.get("/get-new-arrival-product", catalog_controller_1.fetchNewArrivalCatalogs);
    router.put("/update-catalog-product/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, catalog_controller_1.updateProduct);
    router.delete("/delete-catalog-product/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, catalog_controller_1.deleteProduct);
    return router;
}
//# sourceMappingURL=catalog.routes.js.map