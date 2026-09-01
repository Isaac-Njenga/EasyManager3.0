"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
exports.createRoutes = createRoutes;
const express_1 = require("express");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const shop_routes_1 = require("../modules/Shops/shop.routes");
const warehouse_routes_1 = require("../modules/Warehouses/warehouse.routes");
function createRoutes() {
    const router = (0, express_1.Router)();
    router.use("/auth", (0, auth_routes_1.AuthRouter)());
    router.use("/shop", (0, shop_routes_1.ShopRouter)());
    router.use("/warehouse", (0, warehouse_routes_1.WarehouseRouter)());
    return router;
}
exports.appRouter = createRoutes();
//# sourceMappingURL=routes.js.map