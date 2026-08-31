"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShop = exports.updateShop = exports.fetchShopById = exports.fetchShops = exports.createShop = void 0;
const BadRequestError_1 = require("../../common/errors/BadRequestError");
const catchAsync_1 = require("../../common/utils/catchAsync");
const logs_service_1 = require("../Logs/logs.service");
const shop_service_1 = require("./shop.service");
const getShopIdParam = (id) => {
    if (!id) {
        throw new BadRequestError_1.BadRequestError("Shop ID is required");
    }
    return Array.isArray(id) ? id[0] : id;
};
exports.createShop = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body) {
        throw new BadRequestError_1.BadRequestError("Request body is required");
    }
    const shop = await shop_service_1.ShopService.createShop(req.body, req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "shop",
        refId: shop._id.toString(),
        action: "created",
        title: "Shop created",
        description: `New shop '${shop.name}' was created`,
        refModel: "shop",
        actor: req.user?._id,
    });
    res.status(201).json({
        success: true,
        data: shop,
        message: "Shop created successfully",
    });
});
exports.fetchShops = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const shops = await shop_service_1.ShopService.fetchShops({
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search,
        status: req.query.status,
        type: req.query.type,
    });
    res.status(200).json({
        success: true,
        data: shops,
        message: "Shops fetched successfully",
    });
});
exports.fetchShopById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getShopIdParam(req.params.id);
    const shop = await shop_service_1.ShopService.fetchShopById(id, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "shop",
        refId: id,
        action: "received",
        title: "Shop profile retrieved",
        description: `Fetched profile for shop ${id}`,
        refModel: "shop", // Fixed: was previously "patient"
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: shop,
        message: "Shop retrieved successfully",
    });
});
exports.updateShop = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getShopIdParam(req.params.id);
    const shop = await shop_service_1.ShopService.updateShop(id, req.body, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "shop",
        refId: id,
        action: "updated",
        title: "Shop updated",
        description: `Updated profile for shop ${id}`,
        refModel: "shop",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: shop,
        message: "Shop updated successfully",
    });
});
exports.deleteShop = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getShopIdParam(req.params.id);
    const shop = await shop_service_1.ShopService.deleteShop(id, req.user._id.toString(), req.user?.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "shop",
        refId: id,
        action: "deleted",
        title: "Shop deleted",
        description: `Deleted shop ${id}`,
        refModel: "shop",
        actor: req.user?._id,
    });
    res.status(200).json({
        success: true,
        data: shop,
        message: "Shop deleted successfully",
    });
});
//# sourceMappingURL=shop.controller.js.map