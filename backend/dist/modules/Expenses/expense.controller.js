"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.fetchExpenseById = exports.fetchExpenses = exports.createExpense = void 0;
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const catchAsync_1 = require("../../common/utils/catchAsync");
const logs_service_1 = require("../Logs/logs.service");
const expense_service_1 = require("./expense.service");
const getExpenseIdParam = (id) => {
    if (!id) {
        throw new BadRequestError_1.BadRequestError("Expense ID is required");
    }
    return Array.isArray(id) ? id[0] : id;
};
exports.createExpense = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body) {
        throw new BadRequestError_1.BadRequestError("Request body is required");
    }
    const expense = await expense_service_1.ExpenseService.createExpense(req.body, req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "expense",
        refId: expense._id.toString(),
        action: "created",
        title: "Expense created",
        description: `New Expense: '${expense._id}' was created`,
        refModel: "expense",
        actor: req.user?._id,
    });
    res.status(201).json({
        success: true,
        data: expense,
        message: "Expense created successfully",
    });
});
exports.fetchExpenses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const expenses = await expense_service_1.ExpenseService.fetchExpenses({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
    });
    res.status(200).json({
        success: true,
        data: expenses,
        message: "Expenses fetched successfully",
    });
});
exports.fetchExpenseById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getExpenseIdParam(req.params.id);
    const expense = await expense_service_1.ExpenseService.fetchExpenseById(id, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "expense",
        refId: id,
        action: "received",
        title: "Expense profile retrieved",
        description: `Fetched profile for expense ${id}`,
        refModel: "expense",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: expense,
        message: "Expense retrieved successfully",
    });
});
exports.updateExpense = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getExpenseIdParam(req.params.id);
    const expense = await expense_service_1.ExpenseService.updateExpense(id, req.body, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "expense",
        refId: id,
        action: "updated",
        title: "Expense updated",
        description: `Updated profile for expense ${id}`,
        refModel: "expense",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: expense,
        message: "Expense updated successfully",
    });
});
exports.deleteExpense = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getExpenseIdParam(req.params.id);
    const expense = await expense_service_1.ExpenseService.deleteExpense(id, req.user._id.toString(), req.user?.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "expense",
        refId: id,
        action: "deleted",
        title: "Expense deleted",
        description: `Deleted Expense ${id}`,
        refModel: "expense",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: expense,
        message: "Expense deleted successfully",
    });
});
//# sourceMappingURL=expense.controller.js.map