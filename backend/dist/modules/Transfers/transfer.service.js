"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const transfer_model_1 = require("./transfer.model");
const flattenObject_1 = require("../../utils/flattenObject");
const TransferCache = new node_cache_1.default({ stdTTL: 300 });
const invalidateTransferCache = () => {
    TransferCache.flushAll();
};
const PRODUCT_PROFILE_POPULATE = [{ path: "items", model: "Product" }];
const hydrateLocationRefs = async (transfer) => {
    if (transfer?.source?.locationId) {
        const sourceModel = transfer.source.locationType === "Warehouse"
            ? mongoose_1.default.model("Warehouse")
            : mongoose_1.default.model("Shop");
        transfer.source.locationId = await sourceModel
            .findById(transfer.source.locationId)
            .lean();
    }
    if (transfer?.destination?.locationId) {
        const destinationModel = transfer.destination.locationType === "Warehouse"
            ? mongoose_1.default.model("Warehouse")
            : mongoose_1.default.model("Shop");
        transfer.destination.locationId = await destinationModel
            .findById(transfer.destination.locationId)
            .lean();
    }
    return transfer;
};
// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set([
    "type",
    "source",
    "destination",
    "dateOfTransfer",
]);
const BLOCKED_UPDATE_FIELDS = new Set([
    "_id",
    "id",
    "createdAt",
    "updatedAt",
]);
const assertTransferId = (transferId) => {
    if (!transferId) {
        throw new BadRequestError_1.BadRequestError("Transfer ID is required");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(transferId)) {
        throw new BadRequestError_1.BadRequestError("Invalid Transfer ID format");
    }
};
const toTransfer = (transfer) => transfer;
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
class TransferService {
    static async createTransfer(data, requesterRole) {
        const createData = sanitizeCreateData(data, requesterRole);
        const transferDoc = new transfer_model_1.TransferModel(createData);
        await transferDoc.save();
        const savedTransfer = await transfer_model_1.TransferModel.findById(transferDoc._id)
            .populate(PRODUCT_PROFILE_POPULATE)
            .lean();
        const hydratedTransfer = await hydrateLocationRefs(savedTransfer ?? transferDoc.toObject());
        invalidateTransferCache();
        return toTransfer(hydratedTransfer);
    }
    // Pure service method decoupled from Express Request
    static async fetchTransfers(queryParams) {
        const page = Math.max(1, queryParams.page || 1);
        const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
        const skip = (page - 1) * limit;
        const cacheKey = `transfers_p${page}_l${limit}`;
        const cachedData = TransferCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        // Build dynamic MongoDB filter query
        const filter = {};
        const [transfers, totalTransfers] = await Promise.all([
            transfer_model_1.TransferModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate(PRODUCT_PROFILE_POPULATE)
                .lean(),
            transfer_model_1.TransferModel.countDocuments(filter),
        ]);
        const hydratedTransfers = await Promise.all(transfers.map((transfer) => hydrateLocationRefs(transfer)));
        const responseData = {
            inventoryTransfers: hydratedTransfers,
            totalInventoryTransfers: totalTransfers,
            currentPage: page,
            totalPages: Math.ceil(totalTransfers / limit) || 1,
        };
        TransferCache.set(cacheKey, responseData);
        return responseData;
    }
    static async fetchTransferById(transferId, requesterId, requesterRole) {
        assertTransferId(transferId);
        const cacheKey = `transfer_detail_${transferId}`;
        const cachedTransfer = TransferCache.get(cacheKey);
        if (cachedTransfer)
            return cachedTransfer;
        const transfer = await transfer_model_1.TransferModel.findById(transferId)
            .populate(PRODUCT_PROFILE_POPULATE)
            .lean();
        if (!transfer) {
            throw new NotFoundError_1.NotFoundError("Transfer not found!");
        }
        const hydratedTransfer = await hydrateLocationRefs(transfer);
        const result = toTransfer(hydratedTransfer);
        TransferCache.set(cacheKey, result);
        return result;
    }
    static async updateTransfer(transferId, data, requesterId, requesterRole) {
        assertTransferId(transferId);
        const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);
        const transfer = await transfer_model_1.TransferModel.findByIdAndUpdate(transferId, { $set: flattenedUpdateData }, { new: true, runValidators: true })
            .populate(PRODUCT_PROFILE_POPULATE)
            .lean();
        if (!transfer) {
            throw new NotFoundError_1.NotFoundError("Transfer not found!");
        }
        const hydratedTransfer = await hydrateLocationRefs(transfer);
        invalidateTransferCache();
        return toTransfer(hydratedTransfer);
    }
    static async deleteTransfer(transferId, requesterId, requesterRole) {
        assertTransferId(transferId);
        const transfer = await transfer_model_1.TransferModel.findByIdAndDelete(transferId)
            .populate(PRODUCT_PROFILE_POPULATE)
            .lean();
        if (!transfer) {
            throw new NotFoundError_1.NotFoundError("Transfer not found!");
        }
        const hydratedTransfer = await hydrateLocationRefs(transfer);
        invalidateTransferCache();
        return toTransfer(hydratedTransfer);
    }
}
exports.TransferService = TransferService;
//# sourceMappingURL=transfer.service.js.map