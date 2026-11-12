"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = void 0;
const access_policy_1 = require("./access-policy");
const BadRequestError_1 = require("../common/errors/BadRequestError");
const catchAsync_1 = require("../common/utils/catchAsync");
exports.adminRoute = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    (0, access_policy_1.assertAuditReadOnly)(req.user?.role, req.method);
    if (!(0, access_policy_1.canAccessAdminRoute)(req.user?.role, req.method)) {
        throw new BadRequestError_1.BadRequestError("Only admins can access this route. Access denied!");
    }
    next();
});
//# sourceMappingURL=admin.middleware.js.map