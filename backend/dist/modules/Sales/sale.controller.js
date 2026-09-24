"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSale = exports.updateSale = exports.fetchSaleById = exports.fetchSales = exports.getSaleCreationContext = exports.createSale = void 0;
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const catchAsync_1 = require("../../common/utils/catchAsync");
const logs_service_1 = require("../Logs/logs.service");
const sale_service_1 = require("./sale.service");
const socket_1 = require("../../ws/socket");
const getSaleIdParam = (id) => {
    if (!id) {
        throw new BadRequestError_1.BadRequestError("Sale ID is required");
    }
    return Array.isArray(id) ? id[0] : id;
};
exports.createSale = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body) {
        throw new BadRequestError_1.BadRequestError("Request body is required");
    }
    const sale = await sale_service_1.SaleService.createSale(req.body, req.user.role, req.user._id.toString());
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "sale",
        refId: sale._id.toString(),
        action: "created",
        title: "Sale created",
        description: `New sale: '${sale._id}' was created`,
        refModel: "sale",
        actor: req.user?._id,
    });
    (0, socket_1.broadcastEvent)("dashboard:refresh", { resource: "sale", action: "created" });
    res.status(201).json({
        success: true,
        data: sale,
        message: "Sale created successfully",
    });
});
/**
 * Supplies only the data needed to record a sale.  This keeps a salesperson
 * out of the Products, Shops and Salespersons modules while still allowing
 * the sale form to work.
 */
exports.getSaleCreationContext = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const context = await sale_service_1.SaleService.getCreationContext(req.user._id.toString(), req.user.role);
    res.status(200).json({
        success: true,
        data: context,
        message: "Sale creation context retrieved successfully",
    });
});
exports.fetchSales = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const sales = await sale_service_1.SaleService.fetchSales({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
    });
    res.status(200).json({
        success: true,
        data: sales,
        message: "Sales fetched successfully",
    });
});
exports.fetchSaleById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getSaleIdParam(req.params.id);
    const sale = await sale_service_1.SaleService.fetchSaleById(id, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "sale",
        refId: id,
        action: "received",
        title: "Sale profile retrieved",
        description: `Fetched profile for sale ${id}`,
        refModel: "sale",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: sale,
        message: "Sale retrieved successfully",
    });
});
exports.updateSale = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getSaleIdParam(req.params.id);
    const sale = await sale_service_1.SaleService.updateSale(id, req.body, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "sale",
        refId: id,
        action: "updated",
        title: "Sale updated",
        description: `Updated profile for sale ${id}`,
        refModel: "sale",
        actor: req.user?._id,
    });
    (0, socket_1.broadcastEvent)("dashboard:refresh", { resource: "sale", action: "updated" });
    res.status(200).json({
        success: true,
        data: sale,
        message: "Sale updated successfully",
    });
});
exports.deleteSale = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getSaleIdParam(req.params.id);
    const sale = await sale_service_1.SaleService.deleteSale(id, req.user._id.toString(), req.user?.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "sale",
        refId: id,
        action: "deleted",
        title: "Sale deleted",
        description: `Deleted sale ${id}`,
        refModel: "sale",
        actor: req.user?._id,
    });
    (0, socket_1.broadcastEvent)("dashboard:refresh", { resource: "sale", action: "deleted" });
    res.status(200).json({
        success: true,
        data: sale,
        message: "Sale deleted successfully",
    });
});
//# sourceMappingURL=sale.controller.js.map