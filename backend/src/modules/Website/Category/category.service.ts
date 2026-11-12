import { CategoryModel } from "./category.model";
export class CategoryService {
  static async fetchActiveCategories() {
    return CategoryModel.find({ status: "ACTIVE" })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
  }
}
