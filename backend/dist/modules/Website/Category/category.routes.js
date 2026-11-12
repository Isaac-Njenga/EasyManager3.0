"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRouter = CategoryRouter;
const express_1 = require("express");
const category_service_1 = require("./category.service");
const catchAsync_1 = require("../../../common/utils/catchAsync");
function CategoryRouter() {
    const router = (0, express_1.Router)();
    router.get("/", (0, catchAsync_1.catchAsync)(async (_req, res) => {
        const categories = await category_service_1.CategoryService.fetchActiveCategories();
        res.json({ success: true, data: categories });
    }));
    return router;
}
//# sourceMappingURL=category.routes.js.map