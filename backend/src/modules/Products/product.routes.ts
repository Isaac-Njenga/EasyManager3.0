import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";
import {
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProduct,
  deleteProduct,
} from "./product.controller";

export function ProductRouter(): Router {
  const router = Router();

  router.post("/create-product", protectRoute, adminRoute, createProduct);
  router.get("/get-products", protectRoute, adminRoute, fetchProducts);
  router.get("/get-product/:id", protectRoute, adminRoute, fetchProductById);
  router.put("/update-product/:id", protectRoute, adminRoute, updateProduct);
  router.delete("/delete-product/:id", protectRoute, adminRoute, deleteProduct);

  return router;
}
