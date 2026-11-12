"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessAdminRoute = exports.isReadMethod = void 0;
exports.assertAuditReadOnly = assertAuditReadOnly;
exports.assertNotAuditAccount = assertNotAuditAccount;
const AppErrors_1 = require("../common/errors/AppErrors");
const isReadMethod = (method) => ["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
exports.isReadMethod = isReadMethod;
function assertAuditReadOnly(role, method) {
    if (role === "AUDIT" && !(0, exports.isReadMethod)(method))
        throw new AppErrors_1.AppError("Audit accounts have read-only access", 403);
}
function assertNotAuditAccount(role) {
    if (role === "AUDIT")
        throw new AppErrors_1.AppError("Audit accounts cannot change account details", 403);
}
const canAccessAdminRoute = (role, method) => role === "SUPER_ADMIN" || (role === "AUDIT" && (0, exports.isReadMethod)(method));
exports.canAccessAdminRoute = canAccessAdminRoute;
//# sourceMappingURL=access-policy.js.map