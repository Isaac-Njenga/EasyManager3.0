import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { SaleModel } from "./sale.model";
import {
  CreateSaleDTO,
  UpdateSaleDTO,
  Sale,
  SaleListResponse,
} from "./sale.types";
import { flattenObject } from "../../utils/flattenObject";

const saleCache = new NodeCache({ stdTTL: 300 });

const invalidateSaleCache = (): void => {
  saleCache.flushAll();
};

const PRODUCT_PROFILE_POPULATE = [
  {
    path: "items",
    select:
      "name sku code colour image description category costPrice sellingPrice totalQuantity status inventoryDisribution createdAt updatedAt",
  },
];
const SHOP_PROFILE_POPULATE = [
  {
    path: "shop",
    select:
      "name status shopCode type address inventorySummary inventoryItems notes createdAt updatedAt",
  },
];
const SALEPERSON_PROFILE_POPULATE = [{ path: "saleperson" }];

// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set<string>([
  "items",
  "saleperson",
  "commission",
  "notes",
  "paymentMethod",
  "paymentStatus",
  "status",
]);
const BLOCKED_UPDATE_FIELDS = new Set<string>([
  "_id",
  "id",
  "createdAt",
  "updatedAt",
]);

const assertSaleId = (saleId: string): void => {
  if (!saleId) {
    throw new BadRequestError("Sale ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(saleId)) {
    throw new BadRequestError("Invalid Sale ID format");
  }
};

const toSale = (sale: unknown): Sale => sale as Sale;

const sanitizeCreateData = (
  data: CreateSaleDTO,
  requesterRole?: string,
): Partial<CreateSaleDTO> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Create data is required");
  }
  return { ...data };
};

const sanitizeUpdateData = (
  data: UpdateSaleDTO,
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

export interface FetchSalesQuery {
  page?: number;
  limit?: number;
}

export class SaleService {
  static async createSale(
    data: CreateSaleDTO,
    requesterRole: string,
  ): Promise<Sale> {
    const createData = sanitizeCreateData(data, requesterRole);
    const saleDoc = new SaleModel(createData);

    await saleDoc.save();

    const savedSale = await SaleModel.findById(saleDoc._id).lean();
    invalidateSaleCache();

    return toSale(savedSale ?? saleDoc.toObject());
  }

  // Pure service method decoupled from Express Request
  static async fetchSales(
    queryParams: FetchSalesQuery,
  ): Promise<SaleListResponse> {
    const page = Math.max(1, queryParams.page || 1);
    const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
    const skip = (page - 1) * limit;

    const cacheKey = `sales_p${page}_l${limit}`;

    const cachedData = saleCache.get<SaleListResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Build dynamic MongoDB filter query
    const filter: Record<string, any> = {};

    const [sales, totalSales] = await Promise.all([
      SaleModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate(PRODUCT_PROFILE_POPULATE)
        .populate(SHOP_PROFILE_POPULATE)
        .populate(SALEPERSON_PROFILE_POPULATE)
        .lean(),
      SaleModel.countDocuments(filter),
    ]);

    const responseData: SaleListResponse = {
      sales: sales as unknown as Sale[],
      totalSales: totalSales,
      currentPage: page,
      totalPages: Math.ceil(totalSales / limit) || 1,
    };

    saleCache.set(cacheKey, responseData);
    return responseData;
  }

  static async fetchSaleById(
    saleId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Sale> {
    assertSaleId(saleId);

    const cacheKey = `sale_detail_${saleId}`;
    const cachedSale = saleCache.get<Sale>(cacheKey);
    if (cachedSale) return cachedSale;

    const sale = await SaleModel.findById(saleId)
      .populate(PRODUCT_PROFILE_POPULATE)
      .populate(SHOP_PROFILE_POPULATE)
      .populate(SALEPERSON_PROFILE_POPULATE)
      .lean();
    if (!sale) {
      throw new NotFoundError("Sale not found!");
    }

    const result = toSale(sale);
    saleCache.set(cacheKey, result);
    return result;
  }

  static async updateSale(
    saleId: string,
    data: UpdateSaleDTO,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Sale> {
    assertSaleId(saleId);

    const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);

    const sale = await SaleModel.findByIdAndUpdate(
      saleId,
      { $set: flattenedUpdateData },
      { new: true, runValidators: true },
    )
      .populate(PRODUCT_PROFILE_POPULATE)
      .populate(SHOP_PROFILE_POPULATE)
      .populate(SALEPERSON_PROFILE_POPULATE)
      .lean();

    if (!sale) {
      throw new NotFoundError("Sale not found!");
    }

    invalidateSaleCache();
    return toSale(sale);
  }

  static async deleteSale(
    saleId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Sale> {
    assertSaleId(saleId);

    const sale = await SaleModel.findByIdAndDelete(saleId).lean();
    if (!sale) {
      throw new NotFoundError("Sale not found!");
    }

    invalidateSaleCache();
    return toSale(sale);
  }
}
