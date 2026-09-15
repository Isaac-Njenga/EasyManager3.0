"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebProductService = exports.invalidateProductCache = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const website_model_1 = require("./website.model");
const flattenObject_1 = require("../../utils/flattenObject");
const productCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateProductCache = () => {
    productCache.flushAll();
};
exports.invalidateProductCache = invalidateProductCache;
// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set(["description", "price"]);
const BLOCKED_UPDATE_FIELDS = new Set([
    "_id",
    "id",
    "createdAt",
    "updatedAt",
]);
const assertProductId = (productId) => {
    if (!productId) {
        throw new BadRequestError_1.BadRequestError("Product ID is required");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw new BadRequestError_1.BadRequestError("Invalid Product ID format");
    }
};
const toProduct = (product) => product;
const sanitizeCreateData = (data, requesterRole) => {
    if (!data || Object.keys(data).length === 0) {
        throw new BadRequestError_1.BadRequestError("Create data is required");
    }
    return { ...data };
};
const sanitizeUpdateData = (data, requesterRole) => {
    if (!data || Object.keys(data).length === 0) {
        throw new BadRequestError_1.BadRequestError("Update data is required");
    }
    const updateData = { ...data };
    const restrictedFields = Object.keys(updateData).filter((field) => {
        if (BLOCKED_UPDATE_FIELDS.has(field))
            return true;
        return requesterRole !== "SUPER_ADMIN" && ADMIN_ONLY_FIELDS.has(field);
    });
    if (restrictedFields.length > 0) {
        throw new BadRequestError_1.BadRequestError(`You cannot update these fields: ${restrictedFields.join(", ")}`);
    }
    return (0, flattenObject_1.flattenObject)(updateData);
};
class WebProductService {
    static async createProduct(data, requesterRole) {
        const createData = sanitizeCreateData(data, requesterRole);
        const productDoc = new website_model_1.WebsiteModel(createData);
        await productDoc.save();
        const savedProduct = await website_model_1.WebsiteModel.findById(productDoc._id).lean();
        (0, exports.invalidateProductCache)();
        return toProduct(savedProduct ?? productDoc.toObject());
    }
    static async fetchProducts() {
        const page = Math.max(1);
        const limit = Math.max(1, Math.min(100, 10));
        const skip = (page - 1) * limit;
        const cacheKey = `products_p${page}_l${limit}`;
        const cachedData = productCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        const filter = {};
        const [products, totalProducts] = await Promise.all([
            website_model_1.WebsiteModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            website_model_1.WebsiteModel.countDocuments(filter),
        ]);
        const responseData = {
            webProducts: products,
            totalWebProducts: totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
        };
        //cache response
        productCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchProductById(productId, requesterId, requesterRole) {
        assertProductId(productId);
        const cacheKey = `web_product_detail_${productId}`;
        const cachedProduct = productCache.get(cacheKey);
        if (cachedProduct)
            return cachedProduct;
        const product = await website_model_1.WebsiteModel.findById(productId).lean();
        if (!product) {
            throw new NotFoundError_1.NotFoundError("Product not found!");
        }
        const result = toProduct(product);
        productCache.set(cacheKey, result);
        return result;
    }
    static async fetchBestSellingProducts() {
        const cacheKey = `best_selling_products`;
        const cachedProducts = productCache.get(cacheKey);
        if (cachedProducts)
            return cachedProducts;
        const products = await website_model_1.WebsiteModel.find({ isBestSeller: true })
            .limit(8)
            .lean();
        const result = toProduct(products);
        productCache.set(cacheKey, result);
        return result;
    }
    static async fetchNewArrivalProducts() {
        const cacheKey = `new_arrival_products`;
        const cachedProducts = productCache.get(cacheKey);
        if (cachedProducts)
            return cachedProducts;
        const products = await website_model_1.WebsiteModel.find({ isNewArrival: true })
            .limit(8)
            .lean();
        const result = toProduct(products);
        productCache.set(cacheKey, result);
        return result;
    }
    static async updateProduct(productId, data, requesterId, requesterRole) {
        assertProductId(productId);
        const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);
        const product = await website_model_1.WebsiteModel.findByIdAndUpdate(productId, { $set: flattenedUpdateData }, { new: true, runValidators: true }).lean();
        if (!product) {
            throw new NotFoundError_1.NotFoundError("Product not found!");
        }
        (0, exports.invalidateProductCache)();
        return toProduct(product);
    }
    static async deleteProduct(productId, requesterId, requesterRole) {
        assertProductId(productId);
        const product = await website_model_1.WebsiteModel.findByIdAndDelete(productId).lean();
        if (!product) {
            throw new NotFoundError_1.NotFoundError("Product not found!");
        }
        (0, exports.invalidateProductCache)();
        return toProduct(product);
    }
}
exports.WebProductService = WebProductService;
//# sourceMappingURL=website.service.js.map