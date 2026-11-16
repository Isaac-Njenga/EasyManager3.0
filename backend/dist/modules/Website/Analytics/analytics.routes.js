"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRouter = AnalyticsRouter;
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const analytics_middleware_1 = require("./analytics.middleware");
function AnalyticsRouter() {
    const router = (0, express_1.Router)();
    router.post("/consent", analytics_controller_1.setAnalyticsConsent);
    router.post("/events", analytics_middleware_1.requireAnalyticsConsent, analytics_controller_1.trackAnalyticsEvent);
    return router;
}
//# sourceMappingURL=analytics.routes.js.map