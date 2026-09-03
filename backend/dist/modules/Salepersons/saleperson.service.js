"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalespersonService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const saleperson_model_1 = require("./saleperson.model");
const flattenObject_1 = require("../../utils/flattenObject");
const salespersonCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateSalespersonCache = () => {
    salespersonCache.flushAll();
};
const SHOP_PROFILE_POPULATE = [
    {
        path: "assignedShop",
        select: "name status shopCode type address inventorySummary inventoryItems notes createdAt updatedAt",
    },
];
// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set(["firstName", "lastName", "status"]);
const BLOCKED_UPDATE_FIELDS = new Set([
    "_id",
    "id",
    "createdAt",
    "updatedAt",
]);
const assertSalespersonId = (salespersonId) => {
    if (!salespersonId) {
        throw new BadRequestError_1.BadRequestError("Salesperson ID is required");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(salespersonId)) {
        throw new BadRequestError_1.BadRequestError("Invalid Salesperson ID format");
    }
};
const toSalesperson = (salesperson) => salesperson;
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
class SalespersonService {
    static async createSalesperson(data, requesterRole) {
        const createData = sanitizeCreateData(data, requesterRole);
        const salespersonDoc = new saleperson_model_1.SalespersonModel(createData);
        await salespersonDoc.save();
        const savedSalesperson = await saleperson_model_1.SalespersonModel.findById(salespersonDoc._id).lean();
        invalidateSalespersonCache();
        return toSalesperson(savedSalesperson ?? salespersonDoc.toObject());
    }
    // Pure service method decoupled from Express Request
    static async fetchSalespersons(queryParams) {
        const page = Math.max(1, queryParams.page || 1);
        const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
        const skip = (page - 1) * limit;
        const cacheKey = `sales_p${page}_l${limit}`;
        const cachedData = salespersonCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        // Build dynamic MongoDB filter query
        const filter = {};
        const [salespersons, totalSalespersons] = await Promise.all([
            saleperson_model_1.SalespersonModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate(SHOP_PROFILE_POPULATE)
                .lean(),
            saleperson_model_1.SalespersonModel.countDocuments(filter),
        ]);
        const responseData = {
            salespersons: salespersons,
            totalSalespersons: totalSalespersons,
            currentPage: page,
            totalPages: Math.ceil(totalSalespersons / limit) || 1,
        };
        salespersonCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchSalespersonById(salespersonId, requesterId, requesterRole) {
        assertSalespersonId(salespersonId);
        const cacheKey = `salesperson_detail_${salespersonId}`;
        const cachedSalesperson = salespersonCache.get(cacheKey);
        if (cachedSalesperson)
            return cachedSalesperson;
        const sale = await saleperson_model_1.SalespersonModel.findById(salespersonId)
            .populate(SHOP_PROFILE_POPULATE)
            .lean();
        if (!sale) {
            throw new NotFoundError_1.NotFoundError("Salesperson not found!");
        }
        const result = toSalesperson(sale);
        salespersonCache.set(cacheKey, result);
        return result;
    }
    static async updateSalesperson(salespersonId, data, requesterId, requesterRole) {
        assertSalespersonId(salespersonId);
        const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);
        const sale = await saleperson_model_1.SalespersonModel.findByIdAndUpdate(salespersonId, { $set: flattenedUpdateData }, { new: true, runValidators: true })
            .populate(SHOP_PROFILE_POPULATE)
            .lean();
        if (!sale) {
            throw new NotFoundError_1.NotFoundError("Salesperson not found!");
        }
        invalidateSalespersonCache();
        return toSalesperson(sale);
    }
    static async deleteSalesperson(salespersonId, requesterId, requesterRole) {
        assertSalespersonId(salespersonId);
        const sale = await saleperson_model_1.SalespersonModel.findByIdAndDelete(salespersonId).lean();
        if (!sale) {
            throw new NotFoundError_1.NotFoundError("Salesperson not found!");
        }
        invalidateSalespersonCache();
        return toSalesperson(sale);
    }
}
exports.SalespersonService = SalespersonService;
//# sourceMappingURL=saleperson.service.js.map