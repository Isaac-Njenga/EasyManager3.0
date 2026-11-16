import { Response, NextFunction, Request } from "express";
import { AppError } from "../../../common/errors/AppErrors";
import { hasValidAnalyticsConsent } from "./analytics.consent";

export function requireAnalyticsConsent(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!hasValidAnalyticsConsent(req.headers.cookie)) {
    next(new AppError("Valid analytics consent is required", 403));
    return;
  }
  next();
}
