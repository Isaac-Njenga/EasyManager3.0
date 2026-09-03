import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";
import {
  createExpense,
  fetchExpenses,
  fetchExpenseById,
  updateExpense,
  deleteExpense,
} from "./expense.controller";

export function ExpenseRouter(): Router {
  const router = Router();

  router.post("/create-expense", protectRoute, adminRoute, createExpense);
  router.get("/get-expenses", protectRoute, adminRoute, fetchExpenses);
  router.get("/get-expense/:id", protectRoute, adminRoute, fetchExpenseById);
  router.put("/update-expense/:id", protectRoute, adminRoute, updateExpense);
  router.delete("/delete-expense/:id", protectRoute, adminRoute, deleteExpense);

  return router;
}
