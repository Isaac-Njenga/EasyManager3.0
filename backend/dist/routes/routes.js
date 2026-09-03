"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
exports.createRoutes = createRoutes;
const express_1 = require("express");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const shop_routes_1 = require("../modules/Shops/shop.routes");
const warehouse_routes_1 = require("../modules/Warehouses/warehouse.routes");
const product_routes_1 = require("../modules/Products/product.routes");
const sale_routes_1 = require("../modules/Sales/sale.routes");
const saleperson_routes_1 = require("../modules/Salepersons/saleperson.routes");
const expense_routes_1 = require("../modules/Expenses/expense.routes");
function createRoutes() {
    const router = (0, express_1.Router)();
    router.use("/auth", (0, auth_routes_1.AuthRouter)());
    router.use("/shop", (0, shop_routes_1.ShopRouter)());
    router.use("/warehouse", (0, warehouse_routes_1.WarehouseRouter)());
    router.use("/product", (0, product_routes_1.ProductRouter)());
    router.use("/sale", (0, sale_routes_1.SaleRouter)());
    router.use("/salesperson", (0, saleperson_routes_1.SalespersonRouter)());
    router.use("/expense", (0, expense_routes_1.ExpenseRouter)());
    return router;
}
exports.appRouter = createRoutes();
//# sourceMappingURL=routes.js.map