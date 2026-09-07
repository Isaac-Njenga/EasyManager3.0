import mongoose from "mongoose";
import { BadRequestError } from "../common/errors/BadRequestError";
import { ProductModel } from "../modules/Products/product.model";
import { ShopModel } from "../modules/Shops/shop.model";
import { WarehouseModel } from "../modules/Warehouses/warehouse.model";
import { calculateInventorySummary } from "./inventorySummary";

export type StockLocationType = "Shop" | "Warehouse";
export type StockChange = { product: string; quantity: number };

type InventoryDocument = {
  inventoryItems?: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
  }>;
  inventorySummary?: unknown;
  save: () => Promise<unknown>;
  populate: (path: string) => Promise<unknown>;
};

const getLocationModel = (locationType: StockLocationType) =>
  locationType === "Shop" ? ShopModel : WarehouseModel;

const assertChanges = (changes: StockChange[]): void => {
  if (!changes.length)
    throw new BadRequestError("At least one stock item is required");
  for (const change of changes) {
    if (!mongoose.Types.ObjectId.isValid(change.product)) {
      throw new BadRequestError(`Invalid Product ID format: ${change.product}`);
    }
    if (!Number.isInteger(change.quantity) || change.quantity <= 0) {
      throw new BadRequestError("Stock quantities must be positive integers");
    }
  }
};

export async function applyProductStockChange(
  changes: StockChange[],
  locationType: StockLocationType,
  locationId: string,
  direction: 1 | -1,
  distributionDirection: 1 | -1 = direction,
): Promise<void> {
  assertChanges(changes);

  const totals = new Map<string, number>();
  for (const change of changes) {
    totals.set(
      change.product,
      (totals.get(change.product) ?? 0) + change.quantity,
    );
  }

  for (const [productId, quantity] of totals) {
    const product = await ProductModel.findById(productId).lean();
    if (!product) throw new BadRequestError(`Product not found: ${productId}`);
    if (direction === -1 && product.totalQuantity < quantity) {
      throw new BadRequestError(
        `Insufficient total stock for product ${productId}`,
      );
    }
    const existing = (product.inventoryDistribution ?? []).find(
      (entry: any) => String(entry.locationId) === String(locationId),
    );
    if (
      distributionDirection === -1 &&
      (!existing || existing.quantity < quantity)
    ) {
      throw new BadRequestError(
        `Insufficient stock at ${locationType} ${locationId}`,
      );
    }
  }

  for (const [productId, quantity] of totals) {
    const product = (await ProductModel.findOneAndUpdate(
      direction === -1
        ? { _id: productId, totalQuantity: { $gte: quantity } }
        : { _id: productId },
      { $inc: { totalQuantity: direction * quantity } },
      { new: true, runValidators: true },
    )) as any;

    const distribution: any[] = [...(product.inventoryDistribution ?? [])];
    const existing = distribution.find(
      (entry) => String(entry.locationId) === String(locationId),
    );

    if (existing) {
      if (distributionDirection === -1 && existing.quantity < quantity) {
        throw new BadRequestError(
          `Insufficient stock at ${locationType} ${locationId}`,
        );
      }
      existing.quantity += distributionDirection * quantity;
    } else if (distributionDirection === 1) {
      distribution.push({
        locationType,
        locationId: new mongoose.Types.ObjectId(locationId),
        quantity,
      });
    } else {
      throw new BadRequestError(
        `Product is not stocked at ${locationType} ${locationId}`,
      );
    }

    product.inventoryDistribution = distribution;
    await product.save();
  }
}

export async function applyLocationStockChange(
  locationType: StockLocationType,
  locationId: string,
  changes: StockChange[],
  direction: 1 | -1,
): Promise<void> {
  assertChanges(changes);
  const LocationModel = getLocationModel(locationType) as any;
  const location = (await LocationModel.findById(
    locationId,
  )) as InventoryDocument | null;

  if (!location) throw new BadRequestError(`${locationType} not found`);

  const totals = new Map<string, number>();
  for (const change of changes) {
    totals.set(
      change.product,
      (totals.get(change.product) ?? 0) + change.quantity,
    );
  }

  const items = location.inventoryItems ?? [];
  for (const [productId, quantity] of totals) {
    const item = items.find((entry) => String(entry.product) === productId);
    if (direction === -1 && (!item || item.quantity < quantity)) {
      throw new BadRequestError(
        `Insufficient stock for product ${productId} at ${locationType}`,
      );
    }
  }

  for (const [productId, quantity] of totals) {
    const item = items.find((entry) => String(entry.product) === productId);
    if (item) {
      item.quantity += direction * quantity;
    } else {
      items.push({ product: new mongoose.Types.ObjectId(productId), quantity });
    }
  }

  location.inventoryItems = items.filter((item) => item.quantity > 0);
  await location.populate("inventoryItems.product");
  location.inventorySummary = calculateInventorySummary(
    location.inventoryItems as any,
  );
  await location.save();
}
