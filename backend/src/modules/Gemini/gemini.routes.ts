import { Router } from "express";
import { handleGenerateDescription } from "./gemini.controller";
import { protectRoute } from "../../middleware/auth.middleware";
import { adminRoute } from "../../middleware/admin.middleware";

export function ModelRouter(): Router {
  const router = Router();

  router.post(
    "/generate-description",
    protectRoute,
    adminRoute,
    handleGenerateDescription,
  );
  return router;
}
