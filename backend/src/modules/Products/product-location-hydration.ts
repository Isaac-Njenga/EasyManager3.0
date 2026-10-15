import mongoose from "mongoose";
import { ShopModel } from "../Shops/shop.model";
import { WarehouseModel } from "../Warehouses/warehouse.model";

const LOCATION_PROFILE_SELECT =
  "_id name status type address warehouseCode shopCode";

const getLocationId = (value: unknown): string => {
  if (value && typeof value === "object" && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
};

export const hydrateProductLocationRefs = async (input: any): Promise<any> => {
  const products = Array.isArray(input) ? input : [input];
  const distributions = products.flatMap((product: any) =>
    Array.isArray(product?.inventoryDistribution)
      ? product.inventoryDistribution
      : [],
  );
  if (distributions.length === 0) return input;

  const warehouseIds = [
    ...new Set(
      distributions
        .filter(
          (entry: any) =>
            entry?.locationType === "Warehouse" && entry.locationId != null,
        )
        .map((entry: any) => getLocationId(entry.locationId))
        .filter((id: string) => mongoose.Types.ObjectId.isValid(id)),
    ),
  ];
  const shopIds = [
    ...new Set(
      distributions
        .filter(
          (entry: any) =>
            entry?.locationType === "Shop" && entry.locationId != null,
        )
        .map((entry: any) => getLocationId(entry.locationId))
        .filter((id: string) => mongoose.Types.ObjectId.isValid(id)),
    ),
  ];

  const [warehouses, shops] = await Promise.all([
    warehouseIds.length
      ? WarehouseModel.find({ _id: { $in: warehouseIds } })
          .select(LOCATION_PROFILE_SELECT)
          .lean()
      : [],
    shopIds.length
      ? ShopModel.find({ _id: { $in: shopIds } })
          .select(LOCATION_PROFILE_SELECT)
          .lean()
      : [],
  ]);
  const warehouseLocations = new Map(
    warehouses.map((location) => [String(location._id), location]),
  );
  const shopLocations = new Map(
    shops.map((location) => [String(location._id), location]),
  );

  for (const distribution of distributions) {
    if (!distribution?.locationId) continue;
    const id = getLocationId(distribution.locationId);
    const location =
      distribution.locationType === "Warehouse"
        ? warehouseLocations.get(id)
        : shopLocations.get(id);
    if (location) distribution.locationId = location;
  }

  return input;
};

export const hydrateInventoryProductLocations = async <T>(
  location: T,
): Promise<T> => {
  if (!location || typeof location !== "object") return location;
  const products = (((location as any).inventoryItems ?? []) as any[])
    .map((item) => item?.product)
    .filter((product) => product !== null && typeof product === "object");
  await hydrateProductLocationRefs(products);
  return location;
};
