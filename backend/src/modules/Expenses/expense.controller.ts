import { Response } from "express";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { createLog } from "../Logs/logs.service";
import { ExpenseService } from "./expense.service";
import { CreateExpenseDTO, UpdateExpenseDTO } from "./expense.types";

const getExpenseIdParam = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new BadRequestError("Expense ID is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createExpense = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const expense = await ExpenseService.createExpense(
      req.body as CreateExpenseDTO,
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
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
  },
);

export const fetchExpenses = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const expenses = await ExpenseService.fetchExpenses({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    });

    res.status(200).json({
      success: true,
      data: expenses,
      message: "Expenses fetched successfully",
    });
  },
);

export const fetchExpenseById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getExpenseIdParam(req.params.id);

    const expense = await ExpenseService.fetchExpenseById(
      id,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
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
  },
);

export const updateExpense = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getExpenseIdParam(req.params.id);

    const expense = await ExpenseService.updateExpense(
      id,
      req.body as UpdateExpenseDTO,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
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
  },
);

export const deleteExpense = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getExpenseIdParam(req.params.id);

    const expense = await ExpenseService.deleteExpense(
      id,
      req.user!._id.toString(),
      req.user?.role,
    );

    // Create Audit Log
    await createLog({
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
  },
);
