import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";
import {
  createSalesperson,
  fetchSalespersons,
  fetchSalespersonById,
  updateSalesperson,
  deleteSalesperson,
} from "./saleperson.controller";

export function SalespersonRouter(): Router {
  const router = Router();

  router.post(
    "/create-salesperson",
    protectRoute,
    adminRoute,
    createSalesperson,
  );
  router.get("/get-salespersons", protectRoute, adminRoute, fetchSalespersons);
  router.get(
    "/get-salesperson/:id",
    protectRoute,
    adminRoute,
    fetchSalespersonById,
  );
  router.put(
    "/update-salesperson/:id",
    protectRoute,
    adminRoute,
    updateSalesperson,
  );
  router.delete(
    "/delete-salesperson/:id",
    protectRoute,
    adminRoute,
    deleteSalesperson,
  );

  return router;
}
