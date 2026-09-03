import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";
import {
  createSale,
  fetchSales,
  fetchSaleById,
  updateSale,
  deleteSale,
} from "./sale.controller";

export function SaleRouter(): Router {
  const router = Router();

  router.post("/create-sale", protectRoute, adminRoute, createSale);
  router.get("/get-sales", protectRoute, adminRoute, fetchSales);
  router.get("/get-sale/:id", protectRoute, adminRoute, fetchSaleById);
  router.put("/update-sale/:id", protectRoute, adminRoute, updateSale);
  router.delete("/delete-sale/:id", protectRoute, adminRoute, deleteSale);

  return router;
}
