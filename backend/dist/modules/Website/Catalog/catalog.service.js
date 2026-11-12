"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = exports.invalidateCatalogCache = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../../common/errors/NotFoundError");
const catalog_model_1 = require("./catalog.model");
const category_model_1 = require("../Category/category.model");
const catalog_validation_1 = require("./catalog.validation");
const catalogCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateCatalogCache = () => {
    catalogCache.flushAll();
};
exports.invalidateCatalogCache = invalidateCatalogCache;
const assertCatalogId = (id) => {
    if (!mongoose_1.default.isObjectIdOrHexString(id))
        throw new BadRequestError_1.BadRequestError("Invalid Catalog ID format");
};
const toCatalog = (catalog) => catalog;
const assertCategory = async (id) => {
    if (!(await category_model_1.CategoryModel.exists({ _id: id })))
        throw new BadRequestError_1.BadRequestError("Category does not exist");
};
async function saveCatalog(document) {
    try {
        await document.save();
    }
    catch (error) {
        if (error.code === 11000)
            throw new BadRequestError_1.BadRequestError("A catalog item with this slug already exists");
        if (error instanceof mongoose_1.default.Error.ValidationError)
            throw new BadRequestError_1.BadRequestError(error.message);
        throw error;
    }
}
class CatalogService {
    static async createCatalog(data, requesterRole) {
        const createData = (0, catalog_validation_1.parseCatalogInput)(catalog_validation_1.createCatalogSchema, data);
        await assertCategory(createData.category);
        const catalogDoc = new catalog_model_1.CatalogModel(createData);
        await saveCatalog(catalogDoc);
        const savedCatalog = await catalog_model_1.CatalogModel.findById(catalogDoc._id)
            .populate("category")
            .lean();
        (0, exports.invalidateCatalogCache)();
        return toCatalog(savedCatalog ?? catalogDoc.toObject());
    }
    static async fetchCatalogs(page = 1, requestedLimit = 10) {
        if (!Number.isSafeInteger(page) || page < 1) {
            throw new BadRequestError_1.BadRequestError("Page must be a positive integer");
        }
        if (!Number.isSafeInteger(requestedLimit) || requestedLimit < 1) {
            throw new BadRequestError_1.BadRequestError("Limit must be a positive integer");
        }
        const limit = Math.min(requestedLimit, 100);
        const skip = (page - 1) * limit;
        if (!Number.isSafeInteger(skip)) {
            throw new BadRequestError_1.BadRequestError("Page is too large");
        }
        const cacheKey = `catalogs_p${page}_l${limit}`;
        const cachedData = catalogCache.get(cacheKey);
        if (cachedData)
            return cachedData;
        const [catalogs, totalCatalogs] = await Promise.all([
            catalog_model_1.CatalogModel.find({ status: "PUBLISHED" })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate("category")
                .lean(),
            catalog_model_1.CatalogModel.countDocuments({ status: "PUBLISHED" }),
        ]);
        const responseData = {
            catalog: catalogs,
            totalCatalog: totalCatalogs,
            currentPage: page,
            totalPages: Math.ceil(totalCatalogs / limit),
        };
        catalogCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchAllCatalogs() {
        const cacheKey = "catalogs_all";
        const cachedData = catalogCache.get(cacheKey);
        if (cachedData)
            return cachedData;
        const [catalogs, totalCatalogs] = await Promise.all([
            catalog_model_1.CatalogModel.find({}).sort({ createdAt: -1 }).populate("category").lean(),
            catalog_model_1.CatalogModel.countDocuments({}),
        ]);
        const responseData = {
            catalog: catalogs,
            totalCatalog: totalCatalogs,
            currentPage: 1,
            totalPages: totalCatalogs > 0 ? 1 : 0,
        };
        catalogCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchCatalogById(catalogId) {
        assertCatalogId(catalogId);
        const cacheKey = `catalog_id_${catalogId}`;
        const cachedCatalog = catalogCache.get(cacheKey);
        if (cachedCatalog)
            return cachedCatalog;
        const catalog = await catalog_model_1.CatalogModel.findById(catalogId)
            .populate("category")
            .lean();
        if (!catalog) {
            throw new NotFoundError_1.NotFoundError("Catalog not found!");
        }
        const result = toCatalog(catalog);
        catalogCache.set(cacheKey, result);
        return result;
    }
    static async fetchCatalogBySlug(catalogSlug) {
        if (typeof catalogSlug !== "string" || !catalogSlug.trim())
            throw new BadRequestError_1.BadRequestError("Slug is required");
        const cacheKey = `catalog_slug_${catalogSlug}`;
        const cachedCatalog = catalogCache.get(cacheKey);
        if (cachedCatalog)
            return cachedCatalog;
        const catalog = await catalog_model_1.CatalogModel.findOne({
            slug: catalogSlug.trim().toLowerCase(),
            status: "PUBLISHED",
        })
            .populate("category")
            .lean();
        if (!catalog) {
            throw new NotFoundError_1.NotFoundError("Catalog not found!");
        }
        const result = toCatalog(catalog);
        catalogCache.set(cacheKey, result);
        return result;
    }
    static async searchCatalog(queryParams) {
        const { query, tag, category, minPrice, maxPrice } = queryParams;
        const filter = { status: "PUBLISHED" };
        // 1. Full-text search across indexed fields
        if (query) {
            filter.$text = { $search: query };
        }
        // 2. Exact/Case-insensitive secondary filters
        if (tag) {
            filter.tags = {
                $in: [
                    new RegExp(`^${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
                ],
            };
        }
        if (category) {
            assertCatalogId(category);
            filter.category = new mongoose_1.default.Types.ObjectId(category);
        }
        for (const price of [minPrice, maxPrice]) {
            if (price !== undefined && (!Number.isFinite(price) || price < 0))
                throw new BadRequestError_1.BadRequestError("Price bounds must be nonnegative numbers");
        }
        if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
            throw new BadRequestError_1.BadRequestError("Minimum price cannot exceed maximum price");
        // 3. Price range filtering
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter["pricing.basePrice"] = {};
            if (minPrice !== undefined)
                filter["pricing.basePrice"].$gte = minPrice;
            if (maxPrice !== undefined)
                filter["pricing.basePrice"].$lte = maxPrice;
        }
        const products = await catalog_model_1.CatalogModel.find(filter)
            .select(query ? { score: { $meta: "textScore" } } : {})
            .sort(query ? { score: { $meta: "textScore" } } : { createdAt: -1 })
            .populate("category")
            .lean();
        return toCatalog(products);
    }
    static async fetchBestSellingCatalogProducts() {
        const cacheKey = `best_selling_catalog_products`;
        const cachedProducts = catalogCache.get(cacheKey);
        if (cachedProducts)
            return cachedProducts;
        const products = await catalog_model_1.CatalogModel.find({
            "merchandising.isBestSeller": true,
            status: "PUBLISHED",
        })
            .sort({ "merchandising.sortOrder": 1, createdAt: -1, _id: 1 })
            .limit(8)
            .populate("category")
            .lean();
        const result = toCatalog(products);
        catalogCache.set(cacheKey, result);
        return result;
    }
    static async fetchNewArrivalCatalogs() {
        const cacheKey = `new_arrival_catalog_products`;
        const cachedProducts = catalogCache.get(cacheKey);
        if (cachedProducts)
            return cachedProducts;
        const products = await catalog_model_1.CatalogModel.find({
            "merchandising.isNewArrival": true,
            status: "PUBLISHED",
        })
            .sort({ "merchandising.sortOrder": 1, createdAt: -1, _id: 1 })
            .limit(8)
            .populate("category")
            .lean();
        const result = toCatalog(products);
        catalogCache.set(cacheKey, result);
        return result;
    }
    static async fetchFeaturedCatalogs() {
        const key = "featured_catalog_products";
        const cached = catalogCache.get(key);
        if (cached)
            return cached;
        const products = await catalog_model_1.CatalogModel.find({
            "merchandising.isFeatured": true,
            status: "PUBLISHED",
        })
            .sort({ "merchandising.sortOrder": 1, createdAt: -1, _id: 1 })
            .limit(8)
            .populate("category")
            .lean();
        const result = products;
        catalogCache.set(key, result);
        return result;
    }
    static async updateProduct(productId, data, requesterId, requesterRole) {
        assertCatalogId(productId);
        const update = (0, catalog_validation_1.parseCatalogInput)(catalog_validation_1.updateCatalogSchema, data);
        if (update.category)
            await assertCategory(update.category);
        const product = await catalog_model_1.CatalogModel.findById(productId);
        if (!product)
            throw new NotFoundError_1.NotFoundError("Product not found!");
        for (const [key, value] of Object.entries(update)) {
            if (["pricing", "merchandising", "seo"].includes(key) && value) {
                for (const [nestedKey, nestedValue] of Object.entries(value))
                    product.set(`${key}.${nestedKey}`, nestedValue);
            }
            else
                product.set(key, value);
        }
        await saveCatalog(product);
        await product.populate("category");
        (0, exports.invalidateCatalogCache)();
        return toCatalog(product.toObject({ flattenMaps: true }));
    }
    static async deleteProduct(productId, requesterId, requesterRole) {
        assertCatalogId(productId);
        const product = await catalog_model_1.CatalogModel.findByIdAndDelete(productId)
            .populate("category")
            .lean();
        if (!product) {
            throw new NotFoundError_1.NotFoundError("Product not found!");
        }
        (0, exports.invalidateCatalogCache)();
        return toCatalog(product);
    }
}
exports.CatalogService = CatalogService;
//# sourceMappingURL=catalog.service.js.map