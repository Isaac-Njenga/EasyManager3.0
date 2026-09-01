"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWarehouse = exports.updateWarehouse = exports.fetchWarehouseById = exports.fetchWarehouses = exports.createWarehouse = void 0;
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const catchAsync_1 = require("../../common/utils/catchAsync");
const logs_service_1 = require("../Logs/logs.service");
const warehouse_service_1 = require("./warehouse.service");
const getWarehouseIdParam = (id) => {
    if (!id) {
        throw new BadRequestError_1.BadRequestError("Warehouse ID is required");
    }
    return Array.isArray(id) ? id[0] : id;
};
exports.createWarehouse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body) {
        throw new BadRequestError_1.BadRequestError("Request body is required");
    }
    const warehouse = await warehouse_service_1.WarehouseService.createWarehouse(req.body, req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "warehouse",
        refId: warehouse._id.toString(),
        action: "created",
        title: "Warehouse created",
        description: `New warehouse: '${warehouse.name}' was created`,
        refModel: "warehouse",
        actor: req.user?._id,
    });
    res.status(201).json({
        success: true,
        data: warehouse,
        message: "Warehouse created successfully",
    });
});
exports.fetchWarehouses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const warehouses = await warehouse_service_1.WarehouseService.fetchWarehouses({
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search,
        status: req.query.status,
        type: req.query.type,
    });
    res.status(200).json({
        success: true,
        data: warehouses,
        message: "Warehouses fetched successfully",
    });
});
exports.fetchWarehouseById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getWarehouseIdParam(req.params.id);
    const warehouse = await warehouse_service_1.WarehouseService.fetchWarehouseById(id, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "warehouse",
        refId: id,
        action: "received",
        title: "Warehouse profile retrieved",
        description: `Fetched profile for warehouse ${id}`,
        refModel: "warehouse",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: warehouse,
        message: "Warehouse retrieved successfully",
    });
});
exports.updateWarehouse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getWarehouseIdParam(req.params.id);
    const warehouse = await warehouse_service_1.WarehouseService.updateWarehouse(id, req.body, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "warehouse",
        refId: id,
        action: "updated",
        title: "Warehouse updated",
        description: `Updated profile for warehouse ${id}`,
        refModel: "warehouse",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: warehouse,
        message: "Warehouse updated successfully",
    });
});
exports.deleteWarehouse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getWarehouseIdParam(req.params.id);
    const warehouse = await warehouse_service_1.WarehouseService.deleteWarehouse(id, req.user._id.toString(), req.user?.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "warehouse",
        refId: id,
        action: "deleted",
        title: "Warehouse deleted",
        description: `Deleted warehouse ${id}`,
        refModel: "warehouse",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: warehouse,
        message: "Warehouse deleted successfully",
    });
});
//# sourceMappingURL=warehouse.controller.js.map