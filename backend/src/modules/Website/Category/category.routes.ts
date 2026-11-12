import { Request, Response, Router } from "express";
import { CategoryService } from "./category.service";
import { catchAsync } from "../../../common/utils/catchAsync";
export function CategoryRouter(): Router {
  const router = Router();
  router.get(
    "/",
    catchAsync(async (_req: Request, res: Response) => {
      const categories = await CategoryService.fetchActiveCategories();
      res.json({ success: true, data: categories });
    }),
  );
  return router;
}
