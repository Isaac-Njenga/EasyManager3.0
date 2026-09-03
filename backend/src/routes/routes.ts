import { Router } from "express";
import { AuthRouter } from "../modules/Auth/auth.routes";
import { ShopRouter } from "../modules/Shops/shop.routes";
import { WarehouseRouter } from "../modules/Warehouses/warehouse.routes";
import { ProductRouter } from "../modules/Products/product.routes";
import { SaleRouter } from "../modules/Sales/sale.routes";
import { SalespersonRouter } from "../modules/Salepersons/saleperson.routes";

export function createRoutes(): Router {
  const router = Router();

  router.use("/auth", AuthRouter());
  router.use("/shop", ShopRouter());
  router.use("/warehouse", WarehouseRouter());
  router.use("/product", ProductRouter());
  router.use("/sale", SaleRouter());
  router.use("/salesperson", SalespersonRouter());

  return router;
}

export const appRouter = createRoutes();
