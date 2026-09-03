"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalespersonRouter = SalespersonRouter;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const saleperson_controller_1 = require("./saleperson.controller");
function SalespersonRouter() {
    const router = (0, express_1.Router)();
    router.post("/create-salesperson", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, saleperson_controller_1.createSalesperson);
    router.get("/get-salespersons", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, saleperson_controller_1.fetchSalespersons);
    router.get("/get-salesperson/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, saleperson_controller_1.fetchSalespersonById);
    router.put("/update-salesperson/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, saleperson_controller_1.updateSalesperson);
    router.delete("/delete-salesperson/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, saleperson_controller_1.deleteSalesperson);
    return router;
}
//# sourceMappingURL=saleperson.routes.js.map