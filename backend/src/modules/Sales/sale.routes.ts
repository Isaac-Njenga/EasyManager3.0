import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";
import {
  createSale,
  fetchSales,
  fetchSaleById,
  updateSale,
  deleteSale,
  getSaleCreationContext,
} from "./sale.controller";

export function SaleRouter(): Router {
  const router = Router();

  // Both roles may create a sale. All other sale operations remain admin-only.
  router.get("/creation-context", protectRoute, getSaleCreationContext);
  router.post("/create-sale", protectRoute, createSale);
  router.get("/get-sales", protectRoute, adminRoute, fetchSales);
  router.get("/get-sale/:id", protectRoute, adminRoute, fetchSaleById);
  router.put("/update-sale/:id", protectRoute, adminRoute, updateSale);
  router.delete("/delete-sale/:id", protectRoute, adminRoute, deleteSale);

  return router;
}
