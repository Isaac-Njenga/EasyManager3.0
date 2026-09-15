import { Router } from "express";
import { handleGenerateDescription } from "./gemini.controller";

export function ModelRouter(): Router {
  const router = Router();

  router.post("/generate-description", handleGenerateDescription);
  return router;
}
