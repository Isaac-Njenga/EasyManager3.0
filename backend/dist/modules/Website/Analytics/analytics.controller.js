"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackAnalyticsEvent = exports.setAnalyticsConsent = void 0;
const catchAsync_1 = require("../../../common/utils/catchAsync");
const analytics_consent_1 = require("./analytics.consent");
const analytics_service_1 = require("./analytics.service");
const analytics_validation_1 = require("./analytics.validation");
exports.setAnalyticsConsent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { granted } = (0, analytics_validation_1.parseAnalyticsConsentInput)(req.body);
    if (granted) {
        res.cookie(analytics_consent_1.ANALYTICS_CONSENT_COOKIE, (0, analytics_consent_1.createAnalyticsConsentToken)(), (0, analytics_consent_1.analyticsConsentCookieOptions)());
    }
    else {
        res.clearCookie(analytics_consent_1.ANALYTICS_CONSENT_COOKIE, (0, analytics_consent_1.analyticsConsentClearCookieOptions)());
    }
    res.status(200).json({
        success: true,
        data: { granted },
        message: granted
            ? "Analytics consent recorded"
            : "Analytics consent withdrawn",
    });
});
exports.trackAnalyticsEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, analytics_service_1.recordAnalyticsEvent)(req.body);
    res.status(result.duplicate ? 200 : 201).json({
        success: true,
        data: result,
        message: result.duplicate
            ? "Analytics event was already recorded"
            : "Analytics event recorded",
    });
});
//# sourceMappingURL=analytics.controller.js.map