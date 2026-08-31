import { Router } from "express";
import { AuthRouter } from "../modules/Auth/auth.routes";
import { ShopRouter } from "../modules/Shops/shop.routes";

export function createRoutes(): Router {
  const router = Router();

  router.use("/auth", AuthRouter());
  router.use("/shop", ShopRouter());

  return router;
}

export const appRouter = createRoutes();
