import { assertAuditReadOnly, canAccessAdminRoute } from "./access-policy";
import { Response, NextFunction } from "express";
import { BadRequestError } from "../common/errors/BadRequestError";
import { catchAsync } from "../common/utils/catchAsync";
import { AuthenticatedRequest } from "./auth.middleware";

export const adminRoute = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    assertAuditReadOnly(req.user?.role, req.method);
    if (!canAccessAdminRoute(req.user?.role, req.method)) {
      throw new BadRequestError(
        "Only admins can access this route. Access denied!",
      );
    }

    next();
  },
);
