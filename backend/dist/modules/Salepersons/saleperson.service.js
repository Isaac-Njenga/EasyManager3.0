"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalespersonService = exports.invalidateSalespersonCache = void 0;
exports.splitSalespersonPayload = splitSalespersonPayload;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const saleperson_model_1 = require("./saleperson.model");
const user_model_1 = require("../Users/user.model");
const flattenObject_1 = require("../../utils/flattenObject");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const salespersonCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateSalespersonCache = () => {
    salespersonCache.flushAll();
};
exports.invalidateSalespersonCache = invalidateSalespersonCache;
const SHOP_PROFILE_POPULATE = [
    {
        path: "assignedShop",
        model: "Shop",
    },
];
const SALE_PROFILE_POPULATE = [
    {
        path: "sales",
        model: "Sale",
    },
];
const USER_PROFILE_POPULATE = [
    {
        path: "user",
        model: "User",
        select: "firstname lastname userId avatar role isActivated createdAt updatedAt",
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
async function splitSalespersonPayload(input) {
    const passwordHash = await bcryptjs_1.default.hash(input.password, 10);
    const userDTO = {
        firstname: input.firstName ?? input.firstname,
        lastname: input.lastName ?? input.lastname,
        userId: input.userId,
        password: passwordHash,
        avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${input.userId}`,
        role: input.role,
        isActivated: input.isActivated ?? true,
    };
    const salespersonDTO = {
        firstName: input.firstName ?? input.firstname,
        lastName: input.lastName ?? input.lastname,
        status: input.status,
        assignedShop: input.assignedShop ?? input.assignedShop,
        hireDate: input.hireDate,
    };
    return { userDTO, salespersonDTO };
}
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
        const { userDTO, salespersonDTO } = await splitSalespersonPayload(data);
        // 1. Pre-generate shared ObjectIDs
        const userId = new mongoose_1.default.Types.ObjectId();
        const salespersonId = new mongoose_1.default.Types.ObjectId();
        const createData = sanitizeCreateData(salespersonDTO, requesterRole);
        // 2. Instantiate documents
        const userDoc = new user_model_1.UserModel({
            ...userDTO,
            _id: userId,
        });
        const salespersonDoc = new saleperson_model_1.SalespersonModel({
            ...createData,
            _id: salespersonId,
            user: userId,
        });
        try {
            // Save documents sequentially
            await userDoc.save();
            await salespersonDoc.save();
            (0, exports.invalidateSalespersonCache)();
            return toSalesperson(salespersonDoc.toObject());
        }
        catch (error) {
            // Manual Cleanup Rollback if any write fails
            await Promise.allSettled([
                user_model_1.UserModel.findByIdAndDelete(userId),
                saleperson_model_1.SalespersonModel.findByIdAndDelete(salespersonId),
            ]);
            throw error;
        }
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
                .populate(USER_PROFILE_POPULATE)
                .populate(SHOP_PROFILE_POPULATE)
                .populate(SALE_PROFILE_POPULATE)
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
            .populate(USER_PROFILE_POPULATE)
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
            .populate(USER_PROFILE_POPULATE)
            .populate(SALE_PROFILE_POPULATE)
            .populate(SHOP_PROFILE_POPULATE)
            .lean();
        if (!sale) {
            throw new NotFoundError_1.NotFoundError("Salesperson not found!");
        }
        (0, exports.invalidateSalespersonCache)();
        return toSalesperson(sale);
    }
    static async deleteSalesperson(salespersonId, requesterId, requesterRole) {
        assertSalespersonId(salespersonId);
        const sale = await saleperson_model_1.SalespersonModel.findByIdAndDelete(salespersonId).lean();
        if (!sale) {
            throw new NotFoundError_1.NotFoundError("Salesperson not found!");
        }
        (0, exports.invalidateSalespersonCache)();
        return toSalesperson(sale);
    }
}
exports.SalespersonService = SalespersonService;
//# sourceMappingURL=saleperson.service.js.map