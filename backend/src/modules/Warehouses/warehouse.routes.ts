import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";
import {
  createWarehouse,
  fetchWarehouses,
  fetchWarehouseById,
  updateWarehouse,
  distributeWarehouseInventory,
  deleteWarehouse,
} from "./warehouse.controller";

export function WarehouseRouter(): Router {
  const router = Router();

  router.post("/create-warehouse", protectRoute, adminRoute, createWarehouse);
  router.get("/get-warehouses", protectRoute, adminRoute, fetchWarehouses);
  router.get(
    "/get-warehouse/:id",
    protectRoute,
    adminRoute,
    fetchWarehouseById,
  );
  router.put(
    "/update-warehouse/:id",
    protectRoute,
    adminRoute,
    updateWarehouse,
  );
  router.put(
    "/distribute-inventory/:id",
    protectRoute,
    adminRoute,
    distributeWarehouseInventory,
  );
  router.delete(
    "/delete-warehouse/:id",
    protectRoute,
    adminRoute,
    deleteWarehouse,
  );

  return router;
}
