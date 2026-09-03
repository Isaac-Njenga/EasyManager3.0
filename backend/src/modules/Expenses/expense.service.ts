import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { ExpenseModel } from "./expense.model";
import {
  CreateExpenseDTO,
  UpdateExpenseDTO,
  Expense,
  ExpenseListResponse,
} from "./expense.types";
import { flattenObject } from "../../utils/flattenObject";

const expenseCache = new NodeCache({ stdTTL: 300 });

const invalidateExpenseCache = (): void => {
  expenseCache.flushAll();
};

// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set<string>([
  "category",
  "title",
  "amount",
  "dateOfExpense",
  "paymentMethod",
  "paymentStatus",
  "payee",
]);
const BLOCKED_UPDATE_FIELDS = new Set<string>([
  "_id",
  "id",
  "createdAt",
  "updatedAt",
]);

const assertExpenseId = (expenseId: string): void => {
  if (!expenseId) {
    throw new BadRequestError("Expense ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    throw new BadRequestError("Invalid Expense ID format");
  }
};

const toExpense = (expense: unknown): Expense => expense as Expense;

const sanitizeCreateData = (
  data: CreateExpenseDTO,
  requesterRole?: string,
): Partial<CreateExpenseDTO> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Create data is required");
  }
  return { ...data };
};

const sanitizeUpdateData = (
  data: UpdateExpenseDTO,
  requesterRole?: string,
): Record<string, any> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Update data is required");
  }

  const updateData = { ...data } as Record<string, any>;
  const restrictedFields = Object.keys(updateData).filter((field) => {
    if (BLOCKED_UPDATE_FIELDS.has(field)) return true;
    return requesterRole !== "SUPER_ADMIN" && ADMIN_ONLY_FIELDS.has(field);
  });

  if (restrictedFields.length > 0) {
    throw new BadRequestError(
      `You cannot update these fields: ${restrictedFields.join(", ")}`,
    );
  }

  return flattenObject(updateData);
};

export interface FetchExpensesQuery {
  page?: number;
  limit?: number;
}

export class ExpenseService {
  static async createExpense(
    data: CreateExpenseDTO,
    requesterRole: string,
  ): Promise<Expense> {
    const createData = sanitizeCreateData(data, requesterRole);
    const expenseDoc = new ExpenseModel(createData);

    await expenseDoc.save();

    const savedExpense = await ExpenseModel.findById(expenseDoc._id).lean();
    invalidateExpenseCache();

    return toExpense(savedExpense ?? expenseDoc.toObject());
  }

  // Pure service method decoupled from Express Request
  static async fetchExpenses(
    queryParams: FetchExpensesQuery,
  ): Promise<ExpenseListResponse> {
    const page = Math.max(1, queryParams.page || 1);
    const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
    const skip = (page - 1) * limit;

    const cacheKey = `expenses_p${page}_l${limit}`;

    const cachedData = expenseCache.get<ExpenseListResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Build dynamic MongoDB filter query
    const filter: Record<string, any> = {};

    const [expenses, totalExpenses] = await Promise.all([
      ExpenseModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      ExpenseModel.countDocuments(filter),
    ]);

    const responseData: ExpenseListResponse = {
      expenses: expenses as unknown as Expense[],
      totalExpenses: totalExpenses,
      currentPage: page,
      totalPages: Math.ceil(totalExpenses / limit) || 1,
    };

    expenseCache.set(cacheKey, responseData);
    return responseData;
  }

  static async fetchExpenseById(
    expenseId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Expense> {
    assertExpenseId(expenseId);

    const cacheKey = `expense_detail_${expenseId}`;
    const cachedExpense = expenseCache.get<Expense>(cacheKey);
    if (cachedExpense) return cachedExpense;

    const expense = await ExpenseModel.findById(expenseId).lean();
    if (!expense) {
      throw new NotFoundError("Expense not found!");
    }

    const result = toExpense(expense);
    expenseCache.set(cacheKey, result);
    return result;
  }

  static async updateExpense(
    expenseId: string,
    data: UpdateExpenseDTO,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Expense> {
    assertExpenseId(expenseId);

    const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);

    const expense = await ExpenseModel.findByIdAndUpdate(
      expenseId,
      { $set: flattenedUpdateData },
      { new: true, runValidators: true },
    ).lean();

    if (!expense) {
      throw new NotFoundError("Expense not found!");
    }

    invalidateExpenseCache();
    return toExpense(expense);
  }

  static async deleteExpense(
    expenseId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Expense> {
    assertExpenseId(expenseId);

    const expense = await ExpenseModel.findByIdAndDelete(expenseId).lean();
    if (!expense) {
      throw new NotFoundError("Expense not found!");
    }

    invalidateExpenseCache();
    return toExpense(expense);
  }
}
