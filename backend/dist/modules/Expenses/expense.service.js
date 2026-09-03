"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const expense_model_1 = require("./expense.model");
const flattenObject_1 = require("../../utils/flattenObject");
const expenseCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateExpenseCache = () => {
    expenseCache.flushAll();
};
// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set([
    "category",
    "title",
    "amount",
    "dateOfExpense",
    "paymentMethod",
    "paymentStatus",
    "payee",
]);
const BLOCKED_UPDATE_FIELDS = new Set([
    "_id",
    "id",
    "createdAt",
    "updatedAt",
]);
const assertExpenseId = (expenseId) => {
    if (!expenseId) {
        throw new BadRequestError_1.BadRequestError("Expense ID is required");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(expenseId)) {
        throw new BadRequestError_1.BadRequestError("Invalid Expense ID format");
    }
};
const toExpense = (expense) => expense;
const sanitizeCreateData = (data, requesterRole) => {
    if (!data || Object.keys(data).length === 0) {
        throw new BadRequestError_1.BadRequestError("Create data is required");
    }
    return { ...data };
};
const sanitizeUpdateData = (data, requesterRole) => {
    if (!data || Object.keys(data).length === 0) {
        throw new BadRequestError_1.BadRequestError("Update data is required");
    }
    const updateData = { ...data };
    const restrictedFields = Object.keys(updateData).filter((field) => {
        if (BLOCKED_UPDATE_FIELDS.has(field))
            return true;
        return requesterRole !== "SUPER_ADMIN" && ADMIN_ONLY_FIELDS.has(field);
    });
    if (restrictedFields.length > 0) {
        throw new BadRequestError_1.BadRequestError(`You cannot update these fields: ${restrictedFields.join(", ")}`);
    }
    return (0, flattenObject_1.flattenObject)(updateData);
};
class ExpenseService {
    static async createExpense(data, requesterRole) {
        const createData = sanitizeCreateData(data, requesterRole);
        const expenseDoc = new expense_model_1.ExpenseModel(createData);
        await expenseDoc.save();
        const savedExpense = await expense_model_1.ExpenseModel.findById(expenseDoc._id).lean();
        invalidateExpenseCache();
        return toExpense(savedExpense ?? expenseDoc.toObject());
    }
    // Pure service method decoupled from Express Request
    static async fetchExpenses(queryParams) {
        const page = Math.max(1, queryParams.page || 1);
        const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
        const skip = (page - 1) * limit;
        const cacheKey = `expenses_p${page}_l${limit}`;
        const cachedData = expenseCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        // Build dynamic MongoDB filter query
        const filter = {};
        const [expenses, totalExpenses] = await Promise.all([
            expense_model_1.ExpenseModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            expense_model_1.ExpenseModel.countDocuments(filter),
        ]);
        const responseData = {
            expenses: expenses,
            totalExpenses: totalExpenses,
            currentPage: page,
            totalPages: Math.ceil(totalExpenses / limit) || 1,
        };
        expenseCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchExpenseById(expenseId, requesterId, requesterRole) {
        assertExpenseId(expenseId);
        const cacheKey = `expense_detail_${expenseId}`;
        const cachedExpense = expenseCache.get(cacheKey);
        if (cachedExpense)
            return cachedExpense;
        const expense = await expense_model_1.ExpenseModel.findById(expenseId).lean();
        if (!expense) {
            throw new NotFoundError_1.NotFoundError("Expense not found!");
        }
        const result = toExpense(expense);
        expenseCache.set(cacheKey, result);
        return result;
    }
    static async updateExpense(expenseId, data, requesterId, requesterRole) {
        assertExpenseId(expenseId);
        const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);
        const expense = await expense_model_1.ExpenseModel.findByIdAndUpdate(expenseId, { $set: flattenedUpdateData }, { new: true, runValidators: true }).lean();
        if (!expense) {
            throw new NotFoundError_1.NotFoundError("Expense not found!");
        }
        invalidateExpenseCache();
        return toExpense(expense);
    }
    static async deleteExpense(expenseId, requesterId, requesterRole) {
        assertExpenseId(expenseId);
        const expense = await expense_model_1.ExpenseModel.findByIdAndDelete(expenseId).lean();
        if (!expense) {
            throw new NotFoundError_1.NotFoundError("Expense not found!");
        }
        invalidateExpenseCache();
        return toExpense(expense);
    }
}
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=expense.service.js.map