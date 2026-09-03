import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { SalespersonModel } from "./saleperson.model";
import {
  CreateSalespersonDTO,
  UpdateSalespersonDTO,
  Salesperson,
  SalepersonListResponse,
} from "./saleperson.types";
import { flattenObject } from "../../utils/flattenObject";

const salespersonCache = new NodeCache({ stdTTL: 300 });

const invalidateSalespersonCache = (): void => {
  salespersonCache.flushAll();
};

const SHOP_PROFILE_POPULATE = [
  {
    path: "shop",
    select:
      "name status shopCode type address inventorySummary inventoryItems notes createdAt updatedAt",
  },
];

// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set<string>(["firstName", "lastName", "status"]);
const BLOCKED_UPDATE_FIELDS = new Set<string>([
  "_id",
  "id",
  "createdAt",
  "updatedAt",
]);

const assertSalespersonId = (salespersonId: string): void => {
  if (!salespersonId) {
    throw new BadRequestError("Salesperson ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(salespersonId)) {
    throw new BadRequestError("Invalid Salesperson ID format");
  }
};

const toSalesperson = (salesperson: unknown): Salesperson =>
  salesperson as Salesperson;

const sanitizeCreateData = (
  data: CreateSalespersonDTO,
  requesterRole?: string,
): Partial<CreateSalespersonDTO> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Create data is required");
  }
  return { ...data };
};

const sanitizeUpdateData = (
  data: UpdateSalespersonDTO,
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

export interface FetchSalespersonsQuery {
  page?: number;
  limit?: number;
}

export class SalespersonService {
  static async createSalesperson(
    data: CreateSalespersonDTO,
    requesterRole: string,
  ): Promise<Salesperson> {
    const createData = sanitizeCreateData(data, requesterRole);
    const salespersonDoc = new SalespersonModel(createData);

    await salespersonDoc.save();

    const savedSalesperson = await SalespersonModel.findById(
      salespersonDoc._id,
    ).lean();
    invalidateSalespersonCache();

    return toSalesperson(savedSalesperson ?? salespersonDoc.toObject());
  }

  // Pure service method decoupled from Express Request
  static async fetchSalespersons(
    queryParams: FetchSalespersonsQuery,
  ): Promise<SalepersonListResponse> {
    const page = Math.max(1, queryParams.page || 1);
    const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
    const skip = (page - 1) * limit;

    const cacheKey = `sales_p${page}_l${limit}`;

    const cachedData = salespersonCache.get<SalepersonListResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Build dynamic MongoDB filter query
    const filter: Record<string, any> = {};

    const [salespersons, totalSalespersons] = await Promise.all([
      SalespersonModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate(SHOP_PROFILE_POPULATE)
        .lean(),
      SalespersonModel.countDocuments(filter),
    ]);

    const responseData: SalepersonListResponse = {
      salespersons: salespersons as unknown as Salesperson[],
      totalSalespersons: totalSalespersons,
      currentPage: page,
      totalPages: Math.ceil(totalSalespersons / limit) || 1,
    };

    salespersonCache.set(cacheKey, responseData);
    return responseData;
  }

  static async fetchSalespersonById(
    salespersonId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Salesperson> {
    assertSalespersonId(salespersonId);

    const cacheKey = `salesperson_detail_${salespersonId}`;
    const cachedSalesperson = salespersonCache.get<Salesperson>(cacheKey);
    if (cachedSalesperson) return cachedSalesperson;

    const sale = await SalespersonModel.findById(salespersonId)
      .populate(SHOP_PROFILE_POPULATE)
      .lean();
    if (!sale) {
      throw new NotFoundError("Salesperson not found!");
    }

    const result = toSalesperson(sale);
    salespersonCache.set(cacheKey, result);
    return result;
  }

  static async updateSalesperson(
    salespersonId: string,
    data: UpdateSalespersonDTO,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Salesperson> {
    assertSalespersonId(salespersonId);

    const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);

    const sale = await SalespersonModel.findByIdAndUpdate(
      salespersonId,
      { $set: flattenedUpdateData },
      { new: true, runValidators: true },
    )
      .populate(SHOP_PROFILE_POPULATE)
      .lean();

    if (!sale) {
      throw new NotFoundError("Salesperson not found!");
    }

    invalidateSalespersonCache();
    return toSalesperson(sale);
  }

  static async deleteSalesperson(
    salespersonId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Salesperson> {
    assertSalespersonId(salespersonId);

    const sale = await SalespersonModel.findByIdAndDelete(salespersonId).lean();
    if (!sale) {
      throw new NotFoundError("Salesperson not found!");
    }

    invalidateSalespersonCache();
    return toSalesperson(sale);
  }
}
