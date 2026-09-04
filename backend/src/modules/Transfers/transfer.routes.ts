import { Router } from "express";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";
import {
  createTransfer,
  fetchTransfers,
  fetchTransferById,
  updateTransfer,
  deleteTransfer,
} from "./transfer.controller";

export function TransferRouter(): Router {
  const router = Router();

  router.post("/create-transfer", protectRoute, adminRoute, createTransfer);
  router.get("/get-transfers", protectRoute, adminRoute, fetchTransfers);
  router.get("/get-transfer/:id", protectRoute, adminRoute, fetchTransferById);
  router.put("/update-transfer/:id", protectRoute, adminRoute, updateTransfer);
  router.delete("/delete-transfer/:id", protectRoute, adminRoute, deleteTransfer);

  return router;
}
