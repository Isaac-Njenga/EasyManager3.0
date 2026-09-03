"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRouter = ExpenseRouter;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const expense_controller_1 = require("./expense.controller");
function ExpenseRouter() {
    const router = (0, express_1.Router)();
    router.post("/create-expense", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, expense_controller_1.createExpense);
    router.get("/get-expenses", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, expense_controller_1.fetchExpenses);
    router.get("/get-expense/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, expense_controller_1.fetchExpenseById);
    router.put("/update-expense/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, expense_controller_1.updateExpense);
    router.delete("/delete-expense/:id", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, expense_controller_1.deleteExpense);
    return router;
}
//# sourceMappingURL=expense.routes.js.map