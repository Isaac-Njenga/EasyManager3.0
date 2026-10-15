"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrateInventoryProductLocations = exports.hydrateProductLocationRefs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shop_model_1 = require("../Shops/shop.model");
const warehouse_model_1 = require("../Warehouses/warehouse.model");
const LOCATION_PROFILE_SELECT = "_id name status type address warehouseCode shopCode";
const getLocationId = (value) => {
    if (value && typeof value === "object" && "_id" in value) {
        return String(value._id);
    }
    return String(value);
};
const hydrateProductLocationRefs = async (input) => {
    const products = Array.isArray(input) ? input : [input];
    const distributions = products.flatMap((product) => Array.isArray(product?.inventoryDistribution)
        ? product.inventoryDistribution
        : []);
    if (distributions.length === 0)
        return input;
    const warehouseIds = [
        ...new Set(distributions
            .filter((entry) => entry?.locationType === "Warehouse" && entry.locationId != null)
            .map((entry) => getLocationId(entry.locationId))
            .filter((id) => mongoose_1.default.Types.ObjectId.isValid(id))),
    ];
    const shopIds = [
        ...new Set(distributions
            .filter((entry) => entry?.locationType === "Shop" && entry.locationId != null)
            .map((entry) => getLocationId(entry.locationId))
            .filter((id) => mongoose_1.default.Types.ObjectId.isValid(id))),
    ];
    const [warehouses, shops] = await Promise.all([
        warehouseIds.length
            ? warehouse_model_1.WarehouseModel.find({ _id: { $in: warehouseIds } })
                .select(LOCATION_PROFILE_SELECT)
                .lean()
            : [],
        shopIds.length
            ? shop_model_1.ShopModel.find({ _id: { $in: shopIds } })
                .select(LOCATION_PROFILE_SELECT)
                .lean()
            : [],
    ]);
    const warehouseLocations = new Map(warehouses.map((location) => [String(location._id), location]));
    const shopLocations = new Map(shops.map((location) => [String(location._id), location]));
    for (const distribution of distributions) {
        if (!distribution?.locationId)
            continue;
        const id = getLocationId(distribution.locationId);
        const location = distribution.locationType === "Warehouse"
            ? warehouseLocations.get(id)
            : shopLocations.get(id);
        if (location)
            distribution.locationId = location;
    }
    return input;
};
exports.hydrateProductLocationRefs = hydrateProductLocationRefs;
const hydrateInventoryProductLocations = async (location) => {
    if (!location || typeof location !== "object")
        return location;
    const products = (location.inventoryItems ?? [])
        .map((item) => item?.product)
        .filter((product) => product !== null && typeof product === "object");
    await (0, exports.hydrateProductLocationRefs)(products);
    return location;
};
exports.hydrateInventoryProductLocations = hydrateInventoryProductLocations;
//# sourceMappingURL=product-location-hydration.js.map