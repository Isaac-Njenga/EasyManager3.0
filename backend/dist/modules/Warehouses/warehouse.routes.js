"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseRouter = WarehouseRouter;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const warehouse_controller_1 = require("./warehouse.controller");
function WarehouseRouter() {
    const router = (0, express_1.Router)();
    router.post("/create-warehouse", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, warehouse_controller_1.createWarehouse);
    router.get("/get-warehouses", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, warehouse_controller_1.fetchWarehouses);
    router.get("/get-warehouse/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, warehouse_controller_1.fetchWarehouseById);
    router.put("/update-warehouse/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, warehouse_controller_1.updateWarehouse);
    router.delete("/delete-warehouse/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, warehouse_controller_1.deleteWarehouse);
    return router;
}
//# sourceMappingURL=warehouse.routes.js.map