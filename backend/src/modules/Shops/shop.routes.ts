import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";
import {
  createShop,
  fetchShops,
  fetchShopById,
  updateShop,
  deleteShop,
} from "./shop.controller";

export function ShopRouter(): Router {
  const router = Router();

  router.post("/create-shop", protectRoute, adminRoute, createShop);
  router.get("/get-shops", protectRoute, adminRoute, fetchShops);
  router.get("/get-shop/:id", protectRoute, fetchShopById);
  router.put("/update-shop/:id", protectRoute, updateShop);
  router.delete("/delete-shop/:id", protectRoute, deleteShop);

  return router;
}
