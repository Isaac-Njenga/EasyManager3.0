import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";
import {
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProduct,
  deleteProduct,
} from "./website.controller";

export function WebProductRouter(): Router {
  const router = Router();

  router.post("/create-web-product", protectRoute, adminRoute, createProduct);
  router.get("/get-web-products", fetchProducts);
  router.get(
    "/get-web-product/:id",
    protectRoute,
    adminRoute,
    fetchProductById,
  );
  router.put(
    "/update-web-product/:id",
    protectRoute,
    adminRoute,
    updateProduct,
  );
  router.delete(
    "/delete-web-product/:id",
    protectRoute,
    adminRoute,
    deleteProduct,
  );

  return router;
}
