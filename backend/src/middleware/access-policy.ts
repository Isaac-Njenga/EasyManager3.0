import { AppError } from "../common/errors/AppErrors";
export const isReadMethod = (method: string): boolean =>
  ["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
export function assertAuditReadOnly(
  role: string | undefined,
  method: string,
): void {
  if (role === "AUDIT" && !isReadMethod(method))
    throw new AppError("Audit accounts have read-only access", 403);
}
export function assertNotAuditAccount(role: string | undefined): void {
  if (role === "AUDIT")
    throw new AppError("Audit accounts cannot change account details", 403);
}
export const canAccessAdminRoute = (
  role: string | undefined,
  method: string,
): boolean =>
  role === "SUPER_ADMIN" || (role === "AUDIT" && isReadMethod(method));
