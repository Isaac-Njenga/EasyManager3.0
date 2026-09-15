"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRouter = ModelRouter;
const express_1 = require("express");
const gemini_controller_1 = require("./gemini.controller");
function ModelRouter() {
    const router = (0, express_1.Router)();
    router.post("/generate-description", gemini_controller_1.handleGenerateDescription);
    return router;
}
//# sourceMappingURL=gemini.routes.js.map