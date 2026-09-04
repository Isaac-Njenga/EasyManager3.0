"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransfer = exports.updateTransfer = exports.fetchTransferById = exports.fetchTransfers = exports.createTransfer = void 0;
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const catchAsync_1 = require("../../common/utils/catchAsync");
const logs_service_1 = require("../Logs/logs.service");
const transfer_service_1 = require("./transfer.service");
const gettransferIdParam = (id) => {
    if (!id) {
        throw new BadRequestError_1.BadRequestError("transfer ID is required");
    }
    return Array.isArray(id) ? id[0] : id;
};
exports.createTransfer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body) {
        throw new BadRequestError_1.BadRequestError("Request body is required");
    }
    const transfer = await transfer_service_1.TransferService.createTransfer(req.body, req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "transfer",
        refId: transfer._id.toString(),
        action: "created",
        title: "transfer created",
        description: `New transfer: '${transfer.type}' was initiated`,
        refModel: "transfer",
        actor: req.user?._id,
    });
    res.status(201).json({
        success: true,
        data: transfer,
        message: "Transfer created successfully",
    });
});
exports.fetchTransfers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const transfers = await transfer_service_1.TransferService.fetchTransfers({
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    res.status(200).json({
        success: true,
        data: transfers,
        message: "Transfers fetched successfully",
    });
});
exports.fetchTransferById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = gettransferIdParam(req.params.id);
    const transfer = await transfer_service_1.TransferService.fetchTransferById(id, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "transfer",
        refId: id,
        action: "received",
        title: "Transfer profile retrieved",
        description: `Fetched profile for transfer ${id}`,
        refModel: "transfer",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: transfer,
        message: "Transfer retrieved successfully",
    });
});
exports.updateTransfer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = gettransferIdParam(req.params.id);
    const transfer = await transfer_service_1.TransferService.updateTransfer(id, req.body, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "transfer",
        refId: id,
        action: "updated",
        title: "Transfer updated",
        description: `Updated profile for transfer ${id}`,
        refModel: "transfer",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: transfer,
        message: "Transfer updated successfully",
    });
});
exports.deleteTransfer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = gettransferIdParam(req.params.id);
    const transfer = await transfer_service_1.TransferService.deleteTransfer(id, req.user._id.toString(), req.user?.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "transfer",
        refId: id,
        action: "deleted",
        title: "Transfer deleted",
        description: `Deleted transfer ${id}`,
        refModel: "transfer",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: transfer,
        message: "Transfer deleted successfully",
    });
});
//# sourceMappingURL=transfer.controller.js.map