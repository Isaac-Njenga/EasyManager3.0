"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.fetchProductById = exports.fetchProducts = exports.createProduct = void 0;
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const catchAsync_1 = require("../../common/utils/catchAsync");
const logs_service_1 = require("../Logs/logs.service");
const product_service_1 = require("./product.service");
const getProductIdParam = (id) => {
    if (!id) {
        throw new BadRequestError_1.BadRequestError("Product ID is required");
    }
    return Array.isArray(id) ? id[0] : id;
};
exports.createProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body) {
        throw new BadRequestError_1.BadRequestError("Request body is required");
    }
    const product = await product_service_1.ProductService.createProduct(req.body, req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "product",
        refId: product._id.toString(),
        action: "created",
        title: "Product created",
        description: `New product: '${product.name}' was created`,
        refModel: "product",
        actor: req.user?._id,
    });
    res.status(201).json({
        success: true,
        data: product,
        message: "Product created successfully",
    });
});
exports.fetchProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const products = await product_service_1.ProductService.fetchProducts({
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search,
        status: req.query.status,
        category: req.query.category,
    });
    res.status(200).json({
        success: true,
        data: products,
        message: "Products fetched successfully",
    });
});
exports.fetchProductById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getProductIdParam(req.params.id);
    const product = await product_service_1.ProductService.fetchProductById(id, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "product",
        refId: id,
        action: "received",
        title: "Product profile retrieved",
        description: `Fetched profile for product ${id}`,
        refModel: "product",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: product,
        message: "Product retrieved successfully",
    });
});
exports.updateProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getProductIdParam(req.params.id);
    const product = await product_service_1.ProductService.updateProduct(id, req.body, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "product",
        refId: id,
        action: "updated",
        title: "Product updated",
        description: `Updated profile for product ${id}`,
        refModel: "product",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: product,
        message: "Product updated successfully",
    });
});
exports.deleteProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getProductIdParam(req.params.id);
    const product = await product_service_1.ProductService.deleteProduct(id, req.user._id.toString(), req.user?.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "product",
        refId: id,
        action: "deleted",
        title: "Product deleted",
        description: `Deleted product ${id}`,
        refModel: "product",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: product,
        message: "Product deleted successfully",
    });
});
//# sourceMappingURL=product.controller.js.map