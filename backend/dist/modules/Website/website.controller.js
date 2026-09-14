"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.fetchProductById = exports.fetchProducts = exports.createProduct = void 0;
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const catchAsync_1 = require("../../common/utils/catchAsync");
const logs_service_1 = require("../Logs/logs.service");
const website_service_1 = require("./website.service");
const getProductIdParam = (id) => {
    if (!id) {
        throw new BadRequestError_1.BadRequestError("WebProduct ID is required");
    }
    return Array.isArray(id) ? id[0] : id;
};
exports.createProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body) {
        throw new BadRequestError_1.BadRequestError("Request body is required");
    }
    const product = await website_service_1.WebProductService.createProduct(req.body, req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "webproduct",
        refId: product._id.toString(),
        action: "created",
        title: "WebProduct created",
        description: `New webproduct: '${product.name}' was created`,
        refModel: "webproduct",
        actor: req.user?._id,
    });
    res.status(201).json({
        success: true,
        data: product,
        message: "WebProduct created successfully",
    });
});
exports.fetchProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const products = await website_service_1.WebProductService.fetchProducts();
    res.status(200).json({
        success: true,
        data: products,
        message: "WebProducts fetched successfully",
    });
});
exports.fetchProductById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getProductIdParam(req.params.id);
    const product = await website_service_1.WebProductService.fetchProductById(id, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "webproduct",
        refId: id,
        action: "received",
        title: "WebProduct profile retrieved",
        description: `Fetched profile for webproduct ${id}`,
        refModel: "webproduct",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: product,
        message: "WebProduct retrieved successfully",
    });
});
exports.updateProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getProductIdParam(req.params.id);
    const product = await website_service_1.WebProductService.updateProduct(id, req.body, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "webproduct",
        refId: id,
        action: "updated",
        title: "WebProduct updated",
        description: `Updated profile for webproduct ${id}`,
        refModel: "webproduct",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: product,
        message: "WebProduct updated successfully",
    });
});
exports.deleteProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getProductIdParam(req.params.id);
    const product = await website_service_1.WebProductService.deleteProduct(id, req.user._id.toString(), req.user?.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "webproduct",
        refId: id,
        action: "deleted",
        title: "WebProduct deleted",
        description: `Deleted webproduct ${id}`,
        refModel: "webproduct",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: product,
        message: "WebProduct deleted successfully",
    });
});
//# sourceMappingURL=website.controller.js.map