"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const sale_model_1 = require("./sale.model");
const flattenObject_1 = require("../../utils/flattenObject");
const saleCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateSaleCache = () => {
    saleCache.flushAll();
};
const PRODUCT_PROFILE_POPULATE = [
    {
        path: "items.product",
        select: "name sku code colour image description category costPrice sellingPrice totalQuantity status inventoryDisribution createdAt updatedAt",
    },
];
const SHOP_PROFILE_POPULATE = [
    {
        path: "items.shop",
        select: "name status shopCode type address inventorySummary inventoryItems notes createdAt updatedAt",
    },
];
const SALEPERSON_PROFILE_POPULATE = [{ path: "saleperson" }];
// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set([
    "items",
    "saleperson",
    "commission",
    "notes",
    "paymentMethod",
    "paymentStatus",
    "status",
]);
const BLOCKED_UPDATE_FIELDS = new Set([
    "_id",
    "id",
    "createdAt",
    "updatedAt",
]);
const assertSaleId = (saleId) => {
    if (!saleId) {
        throw new BadRequestError_1.BadRequestError("Sale ID is required");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(saleId)) {
        throw new BadRequestError_1.BadRequestError("Invalid Sale ID format");
    }
};
const toSale = (sale) => sale;
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
class SaleService {
    static async createSale(data, requesterRole) {
        const createData = sanitizeCreateData(data, requesterRole);
        const saleDoc = new sale_model_1.SaleModel(createData);
        await saleDoc.save();
        const savedSale = await sale_model_1.SaleModel.findById(saleDoc._id).lean();
        invalidateSaleCache();
        return toSale(savedSale ?? saleDoc.toObject());
    }
    // Pure service method decoupled from Express Request
    static async fetchSales(queryParams) {
        const page = Math.max(1, queryParams.page || 1);
        const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
        const skip = (page - 1) * limit;
        const cacheKey = `sales_p${page}_l${limit}`;
        const cachedData = saleCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        // Build dynamic MongoDB filter query
        const filter = {};
        const [sales, totalSales] = await Promise.all([
            sale_model_1.SaleModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate(PRODUCT_PROFILE_POPULATE)
                .populate(SHOP_PROFILE_POPULATE)
                .populate(SALEPERSON_PROFILE_POPULATE)
                .lean(),
            sale_model_1.SaleModel.countDocuments(filter),
        ]);
        const responseData = {
            sales: sales,
            totalSales: totalSales,
            currentPage: page,
            totalPages: Math.ceil(totalSales / limit) || 1,
        };
        saleCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchSaleById(saleId, requesterId, requesterRole) {
        assertSaleId(saleId);
        const cacheKey = `sale_detail_${saleId}`;
        const cachedSale = saleCache.get(cacheKey);
        if (cachedSale)
            return cachedSale;
        const sale = await sale_model_1.SaleModel.findById(saleId)
            .populate(PRODUCT_PROFILE_POPULATE)
            .populate(SHOP_PROFILE_POPULATE)
            .populate(SALEPERSON_PROFILE_POPULATE)
            .lean();
        if (!sale) {
            throw new NotFoundError_1.NotFoundError("Sale not found!");
        }
        const result = toSale(sale);
        saleCache.set(cacheKey, result);
        return result;
    }
    static async updateSale(saleId, data, requesterId, requesterRole) {
        assertSaleId(saleId);
        const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);
        const sale = await sale_model_1.SaleModel.findByIdAndUpdate(saleId, { $set: flattenedUpdateData }, { new: true, runValidators: true })
            .populate(PRODUCT_PROFILE_POPULATE)
            .populate(SHOP_PROFILE_POPULATE)
            .populate(SALEPERSON_PROFILE_POPULATE)
            .lean();
        if (!sale) {
            throw new NotFoundError_1.NotFoundError("Sale not found!");
        }
        invalidateSaleCache();
        return toSale(sale);
    }
    static async deleteSale(saleId, requesterId, requesterRole) {
        assertSaleId(saleId);
        const sale = await sale_model_1.SaleModel.findByIdAndDelete(saleId).lean();
        if (!sale) {
            throw new NotFoundError_1.NotFoundError("Sale not found!");
        }
        invalidateSaleCache();
        return toSale(sale);
    }
}
exports.SaleService = SaleService;
//# sourceMappingURL=sale.service.js.map