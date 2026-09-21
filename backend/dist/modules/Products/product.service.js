"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = exports.invalidateProductCache = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const product_model_1 = require("./product.model");
const shop_model_1 = require("../Shops/shop.model");
const warehouse_model_1 = require("../Warehouses/warehouse.model");
const flattenObject_1 = require("../../utils/flattenObject");
const productCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateProductCache = () => {
    productCache.flushAll();
};
exports.invalidateProductCache = invalidateProductCache;
const LOCATION_PROFILE_SELECT = "_id name status type address warehouseCode shopCode";
const getLocationId = (value) => {
    if (value && typeof value === "object" && "_id" in value) {
        return String(value._id);
    }
    return String(value);
};
const isPopulatedLocation = (value) => Boolean(value &&
    typeof value === "object" &&
    "name" in value &&
    typeof value.name === "string");
/**
 * Resolves dynamic Shop/Warehouse references without relying on refPath
 * population. This also works for legacy documents saved before refPath was
 * introduced.
 */
const hydrateLocationRefs = async (product) => {
    const distributions = product?.inventoryDistribution;
    if (!Array.isArray(distributions) || distributions.length === 0) {
        return product;
    }
    const warehouseIds = distributions
        .filter((entry) => entry.locationType === "Warehouse" &&
        !isPopulatedLocation(entry.locationId))
        .map((entry) => getLocationId(entry.locationId));
    const shopIds = distributions
        .filter((entry) => entry.locationType === "Shop" && !isPopulatedLocation(entry.locationId))
        .map((entry) => getLocationId(entry.locationId));
    const [warehouses, shops] = await Promise.all([
        warehouseIds.length
            ? warehouse_model_1.WarehouseModel.find({ _id: { $in: warehouseIds } })
                .select(LOCATION_PROFILE_SELECT)
                .lean()
            : [],
        shopIds.length
            ? shop_model_1.ShopModel.find({ _id: { $in: shopIds } })
                .select(LOCATION_PROFILE_SELECT)
                .lean()
            : [],
    ]);
    const locations = new Map([...warehouses, ...shops].map((location) => [String(location._id), location]));
    for (const distribution of distributions) {
        if (isPopulatedLocation(distribution.locationId))
            continue;
        const location = locations.get(getLocationId(distribution.locationId));
        if (location)
            distribution.locationId = location;
    }
    return product;
};
// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set([
    "code",
    "sellingPrice",
    "sku",
    "costPrice",
]);
const BLOCKED_UPDATE_FIELDS = new Set([
    "_id",
    "id",
    "createdAt",
    "updatedAt",
    "totalQuantity",
    "inventoryDistribution",
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
class ProductService {
    static async createProduct(data, requesterRole) {
        const createData = sanitizeCreateData(data, requesterRole);
        const productDoc = new product_model_1.ProductModel(createData);
        await productDoc.save();
        const savedProduct = await product_model_1.ProductModel.findById(productDoc._id).lean();
        (0, exports.invalidateProductCache)();
        return toProduct(await hydrateLocationRefs(savedProduct ?? productDoc.toObject()));
    }
    static async fetchProducts(queryParams) {
        const page = Math.max(1, queryParams.page || 1);
        const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
        const skip = (page - 1) * limit;
        const { search, status, category } = queryParams;
        const cacheKey = `products_p${page}_l${limit}_s${search || ""}_st${status || ""}_c${category || ""}`;
        const cachedData = productCache.get(cacheKey);
        if (cachedData) {
            return {
                ...cachedData,
                products: (await Promise.all(cachedData.products.map(hydrateLocationRefs))),
            };
        }
        const filter = {};
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
                { colour: { $regex: search, $options: "i" } },
            ];
        }
        const [products, totalProducts] = await Promise.all([
            product_model_1.ProductModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            product_model_1.ProductModel.countDocuments(filter),
        ]);
        const responseData = {
            products: (await Promise.all(products.map(hydrateLocationRefs))),
            totalProducts: totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
        };
        //cache response
        productCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchProductById(productId, requesterId, requesterRole) {
        assertProductId(productId);
        const cacheKey = `product_detail_${productId}`;
        const cachedProduct = productCache.get(cacheKey);
        if (cachedProduct) {
            return toProduct(await hydrateLocationRefs(cachedProduct));
        }
        const product = await product_model_1.ProductModel.findById(productId).lean();
        if (!product) {
            throw new NotFoundError_1.NotFoundError("Product not found!");
        }
        const result = toProduct(await hydrateLocationRefs(product));
        productCache.set(cacheKey, result);
        return result;
    }
    static async updateProduct(productId, data, requesterId, requesterRole) {
        assertProductId(productId);
        const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);
        const product = await product_model_1.ProductModel.findByIdAndUpdate(productId, { $set: flattenedUpdateData }, { new: true, runValidators: true }).lean();
        if (!product) {
            throw new NotFoundError_1.NotFoundError("Product not found!");
        }
        (0, exports.invalidateProductCache)();
        return toProduct(await hydrateLocationRefs(product));
    }
    static async deleteProduct(productId, requesterId, requesterRole) {
        assertProductId(productId);
        const product = await product_model_1.ProductModel.findByIdAndDelete(productId).lean();
        if (!product) {
            throw new NotFoundError_1.NotFoundError("Product not found!");
        }
        (0, exports.invalidateProductCache)();
        return toProduct(await hydrateLocationRefs(product));
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map