"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
exports.createRoutes = createRoutes;
const express_1 = require("express");
const auth_routes_1 = require("../modules/Auth/auth.routes");
function createRoutes() {
    const router = (0, express_1.Router)();
    router.use("/auth", (0, auth_routes_1.AuthRouter)());
    return router;
}
exports.appRouter = createRoutes();
//# sourceMappingURL=routes.js.map