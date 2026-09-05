"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const warehouse_model_1 = require("./warehouse.model");
const flattenObject_1 = require("../../utils/flattenObject");
const warehouseCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateWarehouseCache = () => {
    warehouseCache.flushAll();
};
const PRODUCT_PROFILE_POPULATE = [
    { path: "inventoryItems.product", model: "Product" },
];
// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set(["warehouseCode"]);
const BLOCKED_UPDATE_FIELDS = new Set([
    "_id",
    "id",
    "createdAt",
    "updatedAt",
]);
const assertWarehouseId = (warehouseId) => {
    if (!warehouseId) {
        throw new BadRequestError_1.BadRequestError("Warehouse ID is required");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(warehouseId)) {
        throw new BadRequestError_1.BadRequestError("Invalid Warehouse ID format");
    }
};
const toWarehouse = (warehouse) => warehouse;
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
class WarehouseService {
    static async createWarehouse(data, requesterRole) {
        const createData = sanitizeCreateData(data, requesterRole);
        const warehouseDoc = new warehouse_model_1.WarehouseModel(createData);
        await warehouseDoc.save();
        const savedWarehouse = await warehouse_model_1.WarehouseModel.findById(warehouseDoc._id).lean();
        invalidateWarehouseCache();
        return toWarehouse(savedWarehouse ?? warehouseDoc.toObject());
    }
    // Pure service method decoupled from Express Request
    static async fetchWarehouses(queryParams) {
        const page = Math.max(1, queryParams.page || 1);
        const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
        const skip = (page - 1) * limit;
        const { search, status } = queryParams;
        const cacheKey = `warehouses_p${page}_l${limit}_s${search || ""}_st${status || ""}`;
        const cachedData = warehouseCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        // Build dynamic MongoDB filter query
        const filter = {};
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { warehouseCode: { $regex: search, $options: "i" } },
                { "address.city": { $regex: search, $options: "i" } },
            ];
        }
        const [warehouses, totalWarehouses] = await Promise.all([
            warehouse_model_1.WarehouseModel.find(filter)
                .skip(skip)
                .limit(limit)
                .populate(PRODUCT_PROFILE_POPULATE)
                .sort({ createdAt: -1 })
                .lean(),
            warehouse_model_1.WarehouseModel.countDocuments(filter),
        ]);
        const responseData = {
            warehouses: warehouses,
            totalWarehouses: totalWarehouses,
            currentPage: page,
            totalPages: Math.ceil(totalWarehouses / limit) || 1,
        };
        warehouseCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchWarehouseById(warehouseId, requesterId, requesterRole) {
        assertWarehouseId(warehouseId);
        const cacheKey = `warehouse_detail_${warehouseId}`;
        const cachedWarehouse = warehouseCache.get(cacheKey);
        if (cachedWarehouse)
            return cachedWarehouse;
        const warehouse = await warehouse_model_1.WarehouseModel.findById(warehouseId)
            .populate(PRODUCT_PROFILE_POPULATE)
            .lean();
        if (!warehouse) {
            throw new NotFoundError_1.NotFoundError("Warehouse not found!");
        }
        const result = toWarehouse(warehouse);
        warehouseCache.set(cacheKey, result);
        return result;
    }
    static async updateWarehouse(warehouseId, data, requesterId, requesterRole) {
        assertWarehouseId(warehouseId);
        const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);
        const warehouse = await warehouse_model_1.WarehouseModel.findByIdAndUpdate(warehouseId, { $set: flattenedUpdateData }, { new: true, runValidators: true })
            .populate(PRODUCT_PROFILE_POPULATE)
            .lean();
        if (!warehouse) {
            throw new NotFoundError_1.NotFoundError("Warehouse not found!");
        }
        invalidateWarehouseCache();
        return toWarehouse(warehouse);
    }
    static async deleteWarehouse(warehouseId, requesterId, requesterRole) {
        assertWarehouseId(warehouseId);
        const warehouse = await warehouse_model_1.WarehouseModel.findByIdAndDelete(warehouseId)
            .populate(PRODUCT_PROFILE_POPULATE)
            .lean();
        if (!warehouse) {
            throw new NotFoundError_1.NotFoundError("Warehouse not found!");
        }
        invalidateWarehouseCache();
        return toWarehouse(warehouse);
    }
}
exports.WarehouseService = WarehouseService;
//# sourceMappingURL=warehouse.service.js.map