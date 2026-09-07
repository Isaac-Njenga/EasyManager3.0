import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { ShopModel } from "./shop.model";
import {
  CreateShopDTO,
  UpdateShopDTO,
  Shop,
  ShopListResponse,
  ShopDistributionInput,
} from "./shop.types";
import { flattenObject } from "../../utils/flattenObject";
import {
  applyLocationStockChange,
  applyProductStockChange,
} from "../../utils/stock";
import { calculateInventorySummary } from "../../utils/inventorySummary";
import { invalidateProductCache } from "../Products/product.service";

const shopCache = new NodeCache({ stdTTL: 300 });

export const invalidateShopCache = (): void => {
  shopCache.flushAll();
};

const PRODUCT_PROFILE_POPULATE = [
  { path: "inventoryItems.product", model: "Product" },
];

// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set<string>(["shopCode"]);
const BLOCKED_UPDATE_FIELDS = new Set<string>([
  "_id",
  "id",
  "createdAt",
  "updatedAt",
]);

const assertShopId = (shopId: string): void => {
  if (!shopId) {
    throw new BadRequestError("Shop ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    throw new BadRequestError("Invalid Shop ID format");
  }
};

const toShop = (shop: unknown): Shop => shop as Shop;

const sanitizeCreateData = (
  data: CreateShopDTO,
  requesterRole?: string,
): Partial<CreateShopDTO> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Create data is required");
  }
  return { ...data };
};

const sanitizeUpdateData = (
  data: UpdateShopDTO,
  requesterRole?: string,
): Record<string, any> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Update data is required");
  }

  const updateData = { ...data } as Record<string, any>;
  const restrictedFields = Object.keys(updateData).filter((field) => {
    if (BLOCKED_UPDATE_FIELDS.has(field)) return true;
    return requesterRole !== "SUPER_ADMIN" && ADMIN_ONLY_FIELDS.has(field);
  });

  if (restrictedFields.length > 0) {
    throw new BadRequestError(
      `You cannot update these fields: ${restrictedFields.join(", ")}`,
    );
  }

  return flattenObject(updateData);
};

export interface FetchShopsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

export class ShopService {
  static async createShop(
    data: CreateShopDTO,
    requesterRole: string,
  ): Promise<Shop> {
    const createData = sanitizeCreateData(data, requesterRole);
    const shopDoc = new ShopModel(createData);

    await shopDoc.save();

    const savedShop = await ShopModel.findById(shopDoc._id).lean();
    invalidateShopCache();

    return toShop(savedShop ?? shopDoc.toObject());
  }

  // Pure service method decoupled from Express Request
  static async fetchShops(
    queryParams: FetchShopsQuery,
  ): Promise<ShopListResponse> {
    const page = Math.max(1, queryParams.page || 1);
    const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
    const skip = (page - 1) * limit;

    const { search, status, type } = queryParams;
    const cacheKey = `shops_p${page}_l${limit}_s${search || ""}_st${status || ""}_t${type || ""}`;

    const cachedData = shopCache.get<ShopListResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Build dynamic MongoDB filter query
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shopCode: { $regex: search, $options: "i" } },
        { "address.town": { $regex: search, $options: "i" } },
      ];
    }

    const [shops, totalShops] = await Promise.all([
      ShopModel.find(filter)
        .skip(skip)
        .limit(limit)
        .populate(PRODUCT_PROFILE_POPULATE)
        .sort({ createdAt: -1 })
        .lean(),
      ShopModel.countDocuments(filter),
    ]);

    const responseData: ShopListResponse = {
      shops: shops as unknown as Shop[],
      totalShops,
      currentPage: page,
      totalPages: Math.ceil(totalShops / limit) || 1,
    };

    shopCache.set(cacheKey, responseData);
    return responseData;
  }

  static async fetchShopById(
    shopId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Shop> {
    assertShopId(shopId);

    const cacheKey = `shop_detail_${shopId}`;
    const cachedShop = shopCache.get<Shop>(cacheKey);
    if (cachedShop) return cachedShop;

    const shop = await ShopModel.findById(shopId)
      .populate(PRODUCT_PROFILE_POPULATE)
      .lean();
    if (!shop) {
      throw new NotFoundError("Shop not found!");
    }

    const result = toShop(shop);
    shopCache.set(cacheKey, result);
    return result;
  }

  static async updateShop(
    shopId: string,
    data: UpdateShopDTO,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Shop> {
    assertShopId(shopId);

    const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);

    const shop = await ShopModel.findByIdAndUpdate(
      shopId,
      { $set: flattenedUpdateData },
      { new: true, runValidators: true },
    )
      .populate(PRODUCT_PROFILE_POPULATE)
      .lean();

    if (!shop) {
      throw new NotFoundError("Shop not found!");
    }

    if (flattenedUpdateData.inventoryItems) {
      const inventorySummary = calculateInventorySummary(
        (shop as any).inventoryItems,
      );
      await ShopModel.findByIdAndUpdate(shopId, {
        $set: { inventorySummary },
      });
      (shop as any).inventorySummary = inventorySummary;
    }

    invalidateShopCache();
    return toShop(shop);
  }

  static async distributeInventory(
    shopId: string,
    data: ShopDistributionInput,
  ): Promise<Shop> {
    assertShopId(shopId);

    if (!data?.inventoryItems?.length) {
      throw new BadRequestError("At least one inventory item is required");
    }

    const changes = data.inventoryItems;
    await applyLocationStockChange("Shop", shopId, changes, 1);
    await applyProductStockChange(changes, "Shop", shopId, 1, 1);
    invalidateProductCache();

    const shop = await ShopModel.findById(shopId)
      .populate(PRODUCT_PROFILE_POPULATE)
      .lean();

    if (!shop) throw new NotFoundError("Shop not found!");

    invalidateShopCache();
    return toShop(shop);
  }

  static async deleteShop(
    shopId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Shop> {
    assertShopId(shopId);

    const shop = await ShopModel.findByIdAndDelete(shopId).lean();
    if (!shop) {
      throw new NotFoundError("Shop not found!");
    }

    invalidateShopCache();
    return toShop(shop);
  }
}
