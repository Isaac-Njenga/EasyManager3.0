import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { WarehouseModel } from "./warehouse.model";
import {
  CreateWarehouseDTO,
  UpdateWarehouseDTO,
  Warehouse,
  WarehouseListResponse,
} from "./warehouse.types";
import { flattenObject } from "../../utils/flattenObject";

const warehouseCache = new NodeCache({ stdTTL: 300 });

const invalidateWarehouseCache = (): void => {
  warehouseCache.flushAll();
};

// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set<string>(["warehouseCode"]);
const BLOCKED_UPDATE_FIELDS = new Set<string>([
  "_id",
  "id",
  "createdAt",
  "updatedAt",
]);

const assertWarehouseId = (warehouseId: string): void => {
  if (!warehouseId) {
    throw new BadRequestError("Warehouse ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(warehouseId)) {
    throw new BadRequestError("Invalid Warehouse ID format");
  }
};

const toWarehouse = (warehouse: unknown): Warehouse => warehouse as Warehouse;

const sanitizeCreateData = (
  data: CreateWarehouseDTO,
  requesterRole?: string,
): Partial<CreateWarehouseDTO> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Create data is required");
  }
  return { ...data };
};

const sanitizeUpdateData = (
  data: UpdateWarehouseDTO,
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

export interface FetchWarehousesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

export class WarehouseService {
  static async createWarehouse(
    data: CreateWarehouseDTO,
    requesterRole: string,
  ): Promise<Warehouse> {
    const createData = sanitizeCreateData(data, requesterRole);
    const warehouseDoc = new WarehouseModel(createData);

    await warehouseDoc.save();

    const savedWarehouse = await WarehouseModel.findById(warehouseDoc._id).lean();
    invalidateWarehouseCache();

    return toWarehouse(savedWarehouse ?? warehouseDoc.toObject());
  }

  // Pure service method decoupled from Express Request
  static async fetchWarehouses(
    queryParams: FetchWarehousesQuery,
  ): Promise<WarehouseListResponse> {
    const page = Math.max(1, queryParams.page || 1);
    const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
    const skip = (page - 1) * limit;

    const { search, status, type } = queryParams;
    const cacheKey = `warehouses_p${page}_l${limit}_s${search || ""}_st${status || ""}_t${type || ""}`;

    const cachedData = warehouseCache.get<WarehouseListResponse>(cacheKey);
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

    const [warehouses, totalWarehouses] = await Promise.all([
      WarehouseModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      WarehouseModel.countDocuments(filter),
    ]);

    const responseData: WarehouseListResponse = {
      warehouses: warehouses as unknown as Warehouse[],
      totalWarehouses: totalWarehouses,
      currentPage: page,
      totalPages: Math.ceil(totalWarehouses / limit) || 1,
    };

    warehouseCache.set(cacheKey, responseData);
    return responseData;
  }

  static async fetchWarehouseById(
    warehouseId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Warehouse> {
    assertWarehouseId(warehouseId);

    const cacheKey = `warehouse_detail_${warehouseId}`;
    const cachedWarehouse = warehouseCache.get<Warehouse>(cacheKey);
    if (cachedWarehouse) return cachedWarehouse;

    const warehouse = await WarehouseModel.findById(warehouseId).lean();
    if (!warehouse) {
      throw new NotFoundError("Warehouse not found!");
    }

    const result = toWarehouse(warehouse);
    warehouseCache.set(cacheKey, result);
    return result;
  }

  static async updateWarehouse(
    warehouseId: string,
    data: UpdateWarehouseDTO,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Warehouse> {
    assertWarehouseId(warehouseId);

    const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);

    const warehouse = await WarehouseModel.findByIdAndUpdate(
      warehouseId,
      { $set: flattenedUpdateData },
      { new: true, runValidators: true },
    ).lean();

    if (!warehouse) {
      throw new NotFoundError("Warehouse not found!");
    }

    invalidateWarehouseCache();
    return toWarehouse(warehouse);
  }

  static async deleteWarehouse(
    warehouseId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Warehouse> {
    assertWarehouseId(warehouseId);

    const warehouse = await WarehouseModel.findByIdAndDelete(warehouseId).lean();
    if (!warehouse) {
      throw new NotFoundError("Warehouse not found!");
    }

    invalidateWarehouseCache();
    return toWarehouse(warehouse);
  }
}