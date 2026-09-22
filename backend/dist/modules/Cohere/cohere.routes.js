"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohereModelRouter = CohereModelRouter;
const express_1 = require("express");
const cohere_controller_1 = require("./cohere.controller");
// import { protectRoute } from "../../middleware/auth.middleware";
// import { adminRoute } from "../../middleware/admin.middleware";
function CohereModelRouter() {
    const router = (0, express_1.Router)();
    router.post("/generate-description", 
    // protectRoute,
    // adminRoute,
    cohere_controller_1.handleGenerateDescription);
    return router;
}
//# sourceMappingURL=cohere.routes.js.map