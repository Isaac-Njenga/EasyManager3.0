"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFeaturedCatalogs = exports.deleteProduct = exports.updateProduct = exports.fetchNewArrivalCatalogs = exports.fetchBestSellingCatalogProducts = exports.searchProduct = exports.fetchCatalogBySlug = exports.fetchCatalogById = exports.fetchAllCatalogs = exports.fetchCatalogs = exports.createCatalog = void 0;
const BadRequestError_1 = require("../../../common/errors/BadRequestError");
const catchAsync_1 = require("../../../common/utils/catchAsync");
const logs_service_1 = require("../../Logs/logs.service");
const catalog_service_1 = require("./catalog.service");
const socket_1 = require("../../../ws/socket");
const getCatalogIdParam = (id) => {
    if (!id) {
        throw new BadRequestError_1.BadRequestError("Catalog ID is required");
    }
    return Array.isArray(id) ? id[0] : id;
};
exports.createCatalog = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body) {
        throw new BadRequestError_1.BadRequestError("Request body is required");
    }
    const catalog = await catalog_service_1.CatalogService.createCatalog(req.body, req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "catalog",
        refId: catalog._id.toString(),
        action: "created",
        title: "Catalog created",
        description: `New catalog: '${catalog.name}' was created`,
        refModel: "Catalog",
        actor: req.user?._id,
    });
    (0, socket_1.broadcastEvent)("dashboard:refresh", {
        resource: "website",
        action: "created",
    });
    res.status(201).json({
        success: true,
        data: catalog,
        message: "Catalog created successfully",
    });
});
exports.fetchCatalogs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parsePaginationParam = (value, defaultValue, parameterName) => {
        if (value === undefined)
            return defaultValue;
        if (typeof value !== "string" || !/^\d+$/.test(value)) {
            throw new BadRequestError_1.BadRequestError(`${parameterName} must be a positive integer`);
        }
        const parsedValue = Number(value);
        if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
            throw new BadRequestError_1.BadRequestError(`${parameterName} must be a positive integer`);
        }
        return parsedValue;
    };
    const catalogs = await catalog_service_1.CatalogService.fetchCatalogs(parsePaginationParam(req.query.page, 1, "Page"), parsePaginationParam(req.query.limit, 10, "Limit"));
    res.status(200).json({
        success: true,
        data: catalogs,
        message: "Catalogs fetched successfully",
    });
});
exports.fetchAllCatalogs = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const products = await catalog_service_1.CatalogService.fetchAllCatalogs();
    res.status(200).json({
        success: true,
        data: products,
        message: "Catalog products fetched successfully",
    });
});
exports.fetchCatalogById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getCatalogIdParam(req.params.id);
    const catalog = await catalog_service_1.CatalogService.fetchCatalogById(id);
    res.status(200).json({
        success: true,
        data: catalog,
        message: "Catalog retrieved successfully",
    });
});
exports.fetchCatalogBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const slug = Array.isArray(req.params.slug)
        ? req.params.slug[0]
        : req.params.slug;
    const product = await catalog_service_1.CatalogService.fetchCatalogBySlug(slug);
    res.status(200).json({
        success: true,
        data: product,
        message: "Catalog retrieved successfully",
    });
});
const searchProduct = async (req, res, next) => {
    try {
        const { query, tag, category, minPrice, maxPrice } = req.query;
        for (const value of [query, tag, category, minPrice, maxPrice]) {
            if (value !== undefined && (typeof value !== "string" || !value.trim()))
                throw new BadRequestError_1.BadRequestError("Search parameters must be nonempty strings");
        }
        const results = await catalog_service_1.CatalogService.searchCatalog({
            minPrice: minPrice === undefined ? undefined : Number(minPrice),
            maxPrice: maxPrice === undefined ? undefined : Number(maxPrice),
            query: query ? String(query) : undefined,
            tag: tag ? String(tag) : undefined,
            category: category ? String(category) : undefined,
        });
        return res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.searchProduct = searchProduct;
exports.fetchBestSellingCatalogProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const products = await catalog_service_1.CatalogService.fetchBestSellingCatalogProducts();
    res.status(200).json({
        success: true,
        data: products,
        message: "Catalog products fetched successfully",
    });
});
exports.fetchNewArrivalCatalogs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const products = await catalog_service_1.CatalogService.fetchNewArrivalCatalogs();
    res.status(200).json({
        success: true,
        data: products,
        message: "Catalog products fetched successfully",
    });
});
exports.updateProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getCatalogIdParam(req.params.id);
    const product = await catalog_service_1.CatalogService.updateProduct(id, req.body, req.user._id.toString(), req.user.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "catalog",
        refId: id,
        action: "updated",
        title: "Catalog updated",
        description: `Updated profile for catalog ${id}`,
        refModel: "Catalog",
        actor: req.user?._id,
    });
    (0, socket_1.broadcastEvent)("dashboard:refresh", {
        resource: "website",
        action: "updated",
    });
    res.status(200).json({
        success: true,
        data: product,
        message: "Catalog updated successfully",
    });
});
exports.deleteProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = getCatalogIdParam(req.params.id);
    const product = await catalog_service_1.CatalogService.deleteProduct(id, req.user._id.toString(), req.user?.role);
    // Create Audit Log
    await (0, logs_service_1.createLog)({
        type: "catalog",
        refId: id,
        action: "deleted",
        title: "Catalog deleted",
        description: `Deleted catalog ${id}`,
        refModel: "Catalog",
        actor: req.user?._id,
    });
    (0, socket_1.broadcastEvent)("dashboard:refresh", {
        resource: "website",
        action: "deleted",
    });
    res.status(200).json({
        success: true,
        data: product,
        message: "Catalog deleted successfully",
    });
});
exports.fetchFeaturedCatalogs = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    res.json({
        success: true,
        data: await catalog_service_1.CatalogService.fetchFeaturedCatalogs(),
    });
});
//# sourceMappingURL=catalog.controller.js.map