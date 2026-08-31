"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const shop_model_1 = require("./shop.model");
const flattenObject_1 = require("../../utils/flattenObject");
const shopCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateShopCache = () => {
    shopCache.flushAll();
};
// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set(["shopCode"]);
const BLOCKED_UPDATE_FIELDS = new Set([
    "_id",
    "id",
    "createdAt",
    "updatedAt",
]);
const assertShopId = (shopId) => {
    if (!shopId) {
        throw new BadRequestError_1.BadRequestError("Shop ID is required");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(shopId)) {
        throw new BadRequestError_1.BadRequestError("Invalid Shop ID format");
    }
};
const toShop = (shop) => shop;
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
class ShopService {
    static async createShop(data, requesterRole) {
        const createData = sanitizeCreateData(data, requesterRole);
        const shopDoc = new shop_model_1.ShopModel(createData);
        await shopDoc.save();
        const savedShop = await shop_model_1.ShopModel.findById(shopDoc._id).lean();
        invalidateShopCache();
        return toShop(savedShop ?? shopDoc.toObject());
    }
    // Pure service method decoupled from Express Request
    static async fetchShops(queryParams) {
        const page = Math.max(1, queryParams.page || 1);
        const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
        const skip = (page - 1) * limit;
        const { search, status, type } = queryParams;
        const cacheKey = `shops_p${page}_l${limit}_s${search || ""}_st${status || ""}_t${type || ""}`;
        const cachedData = shopCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        // Build dynamic MongoDB filter query
        const filter = {};
        if (status)
            filter.status = status;
        if (type)
            filter.type = type;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { shopCode: { $regex: search, $options: "i" } },
                { "address.town": { $regex: search, $options: "i" } },
            ];
        }
        const [shops, totalShops] = await Promise.all([
            shop_model_1.ShopModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            shop_model_1.ShopModel.countDocuments(filter),
        ]);
        const responseData = {
            shops: shops,
            totalShops,
            currentPage: page,
            totalPages: Math.ceil(totalShops / limit) || 1,
        };
        shopCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchShopById(shopId, requesterId, requesterRole) {
        assertShopId(shopId);
        const cacheKey = `shop_detail_${shopId}`;
        const cachedShop = shopCache.get(cacheKey);
        if (cachedShop)
            return cachedShop;
        const shop = await shop_model_1.ShopModel.findById(shopId).lean();
        if (!shop) {
            throw new NotFoundError_1.NotFoundError("Shop not found!");
        }
        const result = toShop(shop);
        shopCache.set(cacheKey, result);
        return result;
    }
    static async updateShop(shopId, data, requesterId, requesterRole) {
        assertShopId(shopId);
        const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);
        const shop = await shop_model_1.ShopModel.findByIdAndUpdate(shopId, { $set: flattenedUpdateData }, { new: true, runValidators: true }).lean();
        if (!shop) {
            throw new NotFoundError_1.NotFoundError("Shop not found!");
        }
        invalidateShopCache();
        return toShop(shop);
    }
    static async deleteShop(shopId, requesterId, requesterRole) {
        assertShopId(shopId);
        const shop = await shop_model_1.ShopModel.findByIdAndDelete(shopId).lean();
        if (!shop) {
            throw new NotFoundError_1.NotFoundError("Shop not found!");
        }
        invalidateShopCache();
        return toShop(shop);
    }
}
exports.ShopService = ShopService;
//# sourceMappingURL=shop.service.js.map