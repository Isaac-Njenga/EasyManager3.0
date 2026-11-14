import { Router } from "express";
import { protectRoute } from "../../../middleware/auth.middleware";
import { adminRoute } from "../../../middleware/admin.middleware";
import {
  fetchFeaturedCatalogs,
  createCatalog,
  fetchCatalogs,
  fetchAllCatalogs,
  fetchCatalogById,
  updateProduct,
  fetchNewArrivalCatalogs,
  deleteProduct,
  fetchBestSellingCatalogProducts,
  searchProduct,
  fetchCatalogBySlug,
} from "./catalog.controller";

export function CatalogProductRouter(): Router {
  const router = Router();

  router.post(
    "/create-catalog-product",
    protectRoute,
    adminRoute,
    createCatalog,
  );
  router.get("/search", searchProduct);
  router.get("/get-catalog-products", fetchCatalogs);
  router.get("/get-all-catalog-products", fetchAllCatalogs);
  router.get("/get-catalog-product/:slug", fetchCatalogBySlug);
  router.get("/get-catalog-product-by-id/:id", fetchCatalogById);
  router.get("/get-featured-products", fetchFeaturedCatalogs);
  router.get("/get-best-selling-product", fetchBestSellingCatalogProducts);
  router.get("/get-new-arrival-product", fetchNewArrivalCatalogs);
  router.put(
    "/update-catalog-product/:id",
    protectRoute,
    adminRoute,
    updateProduct,
  );
  router.delete(
    "/delete-catalog-product/:id",
    protectRoute,
    adminRoute,
    deleteProduct,
  );

  return router;
}
