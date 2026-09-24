import { Router } from "express";
import { AuthRouter } from "../modules/Auth/auth.routes";
import { ShopRouter } from "../modules/Shops/shop.routes";
import { WarehouseRouter } from "../modules/Warehouses/warehouse.routes";
import { ProductRouter } from "../modules/Products/product.routes";
import { WebProductRouter } from "../modules/Website/website.routes";
import { SaleRouter } from "../modules/Sales/sale.routes";
import { SalespersonRouter } from "../modules/Salepersons/saleperson.routes";
import { ExpenseRouter } from "../modules/Expenses/expense.routes";
import { TransferRouter } from "../modules/Transfers/transfer.routes";
import { GeminiModelRouter } from "../modules/Gemini/gemini.routes";
import { CohereModelRouter } from "../modules/Cohere/cohere.routes";
import { LogsRouter } from "../modules/Logs/logs.routes";

export function createRoutes(): Router {
  const router = Router();

  router.use("/auth", AuthRouter());
  router.use("/shop", ShopRouter());
  router.use("/warehouse", WarehouseRouter());
  router.use("/product", ProductRouter());
  router.use("/web-product", WebProductRouter());
  router.use("/sale", SaleRouter());
  router.use("/salesperson", SalespersonRouter());
  router.use("/expense", ExpenseRouter());
  router.use("/transfer", TransferRouter());
  router.use("/gemini-model", GeminiModelRouter());
  router.use("/cohere-model", CohereModelRouter());
  router.use("/logs", LogsRouter());

  return router;
}

export const appRouter = createRoutes();
