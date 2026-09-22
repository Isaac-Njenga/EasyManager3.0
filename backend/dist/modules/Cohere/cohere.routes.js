"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohereModelRouter = CohereModelRouter;
const express_1 = require("express");
const cohere_controller_1 = require("./cohere.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
function CohereModelRouter() {
    const router = (0, express_1.Router)();
    router.post("/generate-description", auth_middleware_1.protectRoute, admin_middleware_1.adminRoute, cohere_controller_1.handleGenerateDescription);
    return router;
}
//# sourceMappingURL=cohere.routes.js.map