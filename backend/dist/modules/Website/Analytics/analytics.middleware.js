"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAnalyticsConsent = requireAnalyticsConsent;
const AppErrors_1 = require("../../../common/errors/AppErrors");
const analytics_consent_1 = require("./analytics.consent");
function requireAnalyticsConsent(req, _res, next) {
    if (!(0, analytics_consent_1.hasValidAnalyticsConsent)(req.headers.cookie)) {
        next(new AppErrors_1.AppError("Valid analytics consent is required", 403));
        return;
    }
    next();
}
//# sourceMappingURL=analytics.middleware.js.map