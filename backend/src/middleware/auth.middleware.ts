import { assertAuditReadOnly, isReadMethod } from "./access-policy";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { BadRequestError } from "../common/errors/BadRequestError";
import { catchAsync } from "../common/utils/catchAsync";
import { UserModel } from "../modules/Users/user.model";

interface JwtPayloadWithUserId extends JwtPayload {
  userId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function authenticateRequest(
  req: AuthenticatedRequest,
): Promise<void> {
  if (req.user) return;
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new BadRequestError("No token provided. Access denied!");
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayloadWithUserId;
    if (!decoded || typeof decoded === "string" || !decoded.userId)
      throw new Error("Invalid token");
    const user = await UserModel.findById(decoded.userId).select(
      "-password -refreshToken",
    );
    if (!user || !user.isActivated) throw new Error("Account is unavailable");
    req.user = user;
  } catch {
    throw new BadRequestError("Invalid token. Access denied!");
  }
}
export const protectRoute = catchAsync(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    await authenticateRequest(req);
    assertAuditReadOnly(req.user.role, req.method);
    next();
  },
);
// Cover authenticated writes even on routes that do not use protectRoute.
export const restrictAuditWrites = catchAsync(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (
      !isReadMethod(req.method) &&
      req.path !== "/auth/sign-in" &&
      req.header("Authorization")
    ) {
      await authenticateRequest(req);
      assertAuditReadOnly(req.user.role, req.method);
    }
    next();
  },
);
