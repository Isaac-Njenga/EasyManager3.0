"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalesperson = exports.updateSalesperson = exports.fetchSalespersonById = exports.fetchSalespersons = exports.createSalesperson = void 0;
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const catchAsync_1 = require("../../common/utils/catchAsync");
const logs_service_1 = require("../Logs/logs.service");
const saleperson_service_1 = require("./saleperson.service");
const getSalespersonIdParam = (id) => {
    if (!id) {
        throw new BadRequestError_1.BadRequestError("Salesperson ID is required");
    }
    return Array.isArray(id) ? id[0] : id;
};
exports.createSalesperson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body) {
        throw new BadRequestError_1.BadRequestError("Request body is required");
    }
    const salesperson = await saleperson_service_1.SalespersonService.createSalesperson(req.body, req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "salesperson",
        refId: salesperson._id.toString(),
        action: "created",
        title: "Salesperson created",
        description: `New salesperson: '${salesperson._id}' was created`,
        refModel: "salesperson",
        actor: req.user?._id,
    });
    res.status(201).json({
        success: true,
        data: salesperson,
        message: "Salesperson created successfully",
    });
});
exports.fetchSalespersons = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const salespersons = await saleperson_service_1.SalespersonService.fetchSalespersons({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
    });
    res.status(200).json({
        success: true,
        data: salespersons,
        message: "Salespersons fetched successfully",
    });
});
exports.fetchSalespersonById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getSalespersonIdParam(req.params.id);
    const salesperson = await saleperson_service_1.SalespersonService.fetchSalespersonById(id, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "salesperson",
        refId: id,
        action: "received",
        title: "Salesperson profile retrieved",
        description: `Fetched profile for salesperson ${id}`,
        refModel: "salesperson",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: salesperson,
        message: "Salesperson retrieved successfully",
    });
});
exports.updateSalesperson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getSalespersonIdParam(req.params.id);
    const salesperson = await saleperson_service_1.SalespersonService.updateSalesperson(id, req.body, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "salesperson",
        refId: id,
        action: "updated",
        title: "Salesperson updated",
        description: `Updated profile for salesperson ${id}`,
        refModel: "salesperson",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: salesperson,
        message: "Salesperson updated successfully",
    });
});
exports.deleteSalesperson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getSalespersonIdParam(req.params.id);
    const salesperson = await saleperson_service_1.SalespersonService.deleteSalesperson(id, req.user._id.toString(), req.user?.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "salesperson",
        refId: id,
        action: "deleted",
        title: "Salesperson deleted",
        description: `Deleted salesperson ${id}`,
        refModel: "salesperson",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: salesperson,
        message: "Salesperson deleted successfully",
    });
});
//# sourceMappingURL=saleperson.controller.js.map