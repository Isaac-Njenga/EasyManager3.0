"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_model_1 = require("./category.model");
class CategoryService {
    static async fetchActiveCategories() {
        return category_model_1.CategoryModel.find({ status: "ACTIVE" })
            .sort({ sortOrder: 1, name: 1 })
            .lean();
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map