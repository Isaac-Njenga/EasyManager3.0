import { Router } from "express";
import { AuthRouter } from "../modules/Auth/auth.routes";

export function createRoutes(): Router {
  const router = Router();

  router.use("/auth", AuthRouter());

  return router;
}

export const appRouter = createRoutes();
