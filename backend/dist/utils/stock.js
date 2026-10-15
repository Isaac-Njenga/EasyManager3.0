"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyProductStockChange = applyProductStockChange;
exports.applyLocationStockChange = applyLocationStockChange;
exports.setLocationProductQuantity = setLocationProductQuantity;
const mongoose_1 = __importDefault(require("mongoose"));
const BadRequestError_1 = require("../common/errors/BadRequestError");
const product_model_1 = require("../modules/Products/product.model");
const shop_model_1 = require("../modules/Shops/shop.model");
const warehouse_model_1 = require("../modules/Warehouses/warehouse.model");
const inventorySummary_1 = require("./inventorySummary");
const getLocationModel = (locationType) => locationType === "Shop" ? shop_model_1.ShopModel : warehouse_model_1.WarehouseModel;
const getObjectIdString = (value) => {
    if (value && typeof value === "object" && "_id" in value) {
        return String(value._id);
    }
    return String(value);
};
const assertChanges = (changes) => {
    if (!changes.length)
        throw new BadRequestError_1.BadRequestError("At least one stock item is required");
    for (const change of changes) {
        if (!mongoose_1.default.Types.ObjectId.isValid(change.product)) {
            throw new BadRequestError_1.BadRequestError(`Invalid Product ID format: ${change.product}`);
        }
        if (!Number.isInteger(change.quantity) || change.quantity <= 0) {
            throw new BadRequestError_1.BadRequestError("Stock quantities must be positive integers");
        }
    }
};
async function applyProductStockChange(changes, locationType, locationId, direction, distributionDirection = direction === 0 ? 1 : direction) {
    assertChanges(changes);
    const totals = new Map();
    for (const change of changes) {
        totals.set(change.product, (totals.get(change.product) ?? 0) + change.quantity);
    }
    for (const [productId, quantity] of totals) {
        const product = await product_model_1.ProductModel.findById(productId).lean();
        if (!product)
            throw new BadRequestError_1.BadRequestError(`Product not found: ${productId}`);
        if (direction === -1 && product.totalQuantity < quantity) {
            throw new BadRequestError_1.BadRequestError(`Insufficient total stock for product ${productId}`);
        }
        const existing = (product.inventoryDistribution ?? []).find((entry) => getObjectIdString(entry.locationId) === String(locationId));
        if (distributionDirection === -1 &&
            (!existing || existing.quantity < quantity)) {
            throw new BadRequestError_1.BadRequestError(`Insufficient stock at ${locationType} ${locationId}`);
        }
    }
    for (const [productId, quantity] of totals) {
        const product = (await product_model_1.ProductModel.findOneAndUpdate(direction === -1
            ? { _id: productId, totalQuantity: { $gte: quantity } }
            : { _id: productId }, direction === 0 ? {} : { $inc: { totalQuantity: direction * quantity } }, { new: true, runValidators: true }));
        const distribution = [...(product.inventoryDistribution ?? [])];
        const existing = distribution.find((entry) => getObjectIdString(entry.locationId) === String(locationId));
        if (existing) {
            if (distributionDirection === -1 && existing.quantity < quantity) {
                throw new BadRequestError_1.BadRequestError(`Insufficient stock at ${locationType} ${locationId}`);
            }
            existing.quantity += distributionDirection * quantity;
        }
        else if (distributionDirection === 1) {
            distribution.push({
                locationType,
                locationId: new mongoose_1.default.Types.ObjectId(locationId),
                quantity,
            });
        }
        else {
            throw new BadRequestError_1.BadRequestError(`Product is not stocked at ${locationType} ${locationId}`);
        }
        product.inventoryDistribution = distribution;
        await product.save();
    }
}
async function applyLocationStockChange(locationType, locationId, changes, direction) {
    assertChanges(changes);
    const LocationModel = getLocationModel(locationType);
    const location = (await LocationModel.findById(locationId));
    if (!location)
        throw new BadRequestError_1.BadRequestError(`${locationType} not found`);
    const totals = new Map();
    for (const change of changes) {
        totals.set(change.product, (totals.get(change.product) ?? 0) + change.quantity);
    }
    const items = (location.inventoryItems ?? []).filter((entry) => mongoose_1.default.Types.ObjectId.isValid(getObjectIdString(entry.product)));
    for (const [productId, quantity] of totals) {
        const item = items.find((entry) => getObjectIdString(entry.product) === productId);
        if (direction === -1 && (!item || item.quantity < quantity)) {
            throw new BadRequestError_1.BadRequestError(`Insufficient stock for product ${productId} at ${locationType}`);
        }
    }
    for (const [productId, quantity] of totals) {
        const item = items.find((entry) => getObjectIdString(entry.product) === productId);
        if (item) {
            item.quantity += direction * quantity;
        }
        else {
            items.push({ product: new mongoose_1.default.Types.ObjectId(productId), quantity });
        }
    }
    location.inventoryItems = items;
    await location.populate("inventoryItems.product");
    location.inventoryItems = (location.inventoryItems ?? []).filter((item) => item.product != null);
    location.inventorySummary = (0, inventorySummary_1.calculateInventorySummary)(location.inventoryItems);
    await location.save();
}
async function setLocationProductQuantity(locationType, locationId, productId, quantity) {
    if (!mongoose_1.default.Types.ObjectId.isValid(locationId)) {
        throw new BadRequestError_1.BadRequestError(`Invalid ${locationType} ID format`);
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw new BadRequestError_1.BadRequestError("Invalid Product ID format");
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
        throw new BadRequestError_1.BadRequestError("Stock quantity must be a non-negative integer");
    }
    const LocationModel = getLocationModel(locationType);
    const [location, product] = await Promise.all([
        LocationModel.findById(locationId),
        product_model_1.ProductModel.findById(productId),
    ]);
    if (!location)
        throw new BadRequestError_1.BadRequestError(`${locationType} not found`);
    if (!product)
        throw new BadRequestError_1.BadRequestError("Product not found");
    const locationItems = [...(location.inventoryItems ?? [])];
    const locationItem = locationItems.find((entry) => getObjectIdString(entry.product) === productId);
    const previousQuantity = locationItem?.quantity ?? 0;
    const delta = quantity - previousQuantity;
    if (product.totalQuantity + delta < 0) {
        throw new BadRequestError_1.BadRequestError("Adjustment would make total product stock negative");
    }
    const previousTotalQuantity = product.totalQuantity;
    const previousDistributions = (product.inventoryDistribution ?? []).map((entry) => ({ ...entry.toObject?.(), ...entry }));
    const distributions = previousDistributions.map((entry) => ({
        ...entry,
    }));
    const distribution = distributions.find((entry) => getObjectIdString(entry.locationId) === locationId &&
        entry.locationType === locationType);
    if (locationItem) {
        locationItem.quantity = quantity;
    }
    else {
        locationItems.push({
            product: new mongoose_1.default.Types.ObjectId(productId),
            quantity,
        });
    }
    if (distribution) {
        distribution.quantity = quantity;
    }
    else {
        distributions.push({
            locationType,
            locationId: new mongoose_1.default.Types.ObjectId(locationId),
            quantity,
        });
    }
    product.totalQuantity += delta;
    product.set("inventoryDistribution", distributions);
    await product.save();
    try {
        location.inventoryItems = locationItems;
        await location.populate("inventoryItems.product");
        location.inventorySummary = (0, inventorySummary_1.calculateInventorySummary)(location.inventoryItems);
        await location.save();
    }
    catch (error) {
        product.totalQuantity = previousTotalQuantity;
        product.set("inventoryDistribution", previousDistributions);
        await product.save();
        throw error;
    }
}
//# sourceMappingURL=stock.js.map