import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { TransferModel } from "./transfer.model";
import {
  CreateInventoryTransferDTO as CreateTransferDTO,
  UpdateInventoryTransferDTO as UpdateTransferDTO,
  InventoryTransfer as Transfer,
  InventoryTransferListResponse as TransferListResponse,
} from "./transfer.types";
import { flattenObject } from "../../utils/flattenObject";
import {
  applyLocationStockChange,
  applyProductStockChange,
} from "../../utils/stock";
import { invalidateProductCache } from "../Products/product.service";
import { invalidateShopCache } from "../Shops/shop.service";
import { invalidateWarehouseCache } from "../Warehouses/warehouse.service";

const TransferCache = new NodeCache({ stdTTL: 300 });

const invalidateTransferCache = (): void => {
  TransferCache.flushAll();
};

const PRODUCT_PROFILE_POPULATE = [{ path: "items.product", model: "Product" }];

const hydrateLocationRefs = async <
  T extends { source?: any; destination?: any },
>(
  transfer: T,
): Promise<T> => {
  if (transfer?.source?.locationId) {
    const sourceModel =
      transfer.source.locationType === "Warehouse"
        ? mongoose.model("Warehouse")
        : mongoose.model("Shop");

    transfer.source.locationId = await sourceModel
      .findById(transfer.source.locationId)
      .lean();
  }

  if (transfer?.destination?.locationId) {
    const destinationModel =
      transfer.destination.locationType === "Warehouse"
        ? mongoose.model("Warehouse")
        : mongoose.model("Shop");

    transfer.destination.locationId = await destinationModel
      .findById(transfer.destination.locationId)
      .lean();
  }

  return transfer;
};

// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set<string>([
  "type",
  "source",
  "destination",
  "dateOfTransfer",
]);
const BLOCKED_UPDATE_FIELDS = new Set<string>([
  "_id",
  "id",
  "createdAt",
  "updatedAt",
]);

const assertTransferId = (transferId: string): void => {
  if (!transferId) {
    throw new BadRequestError("Transfer ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(transferId)) {
    throw new BadRequestError("Invalid Transfer ID format");
  }
};

const toTransfer = (transfer: unknown): Transfer => transfer as Transfer;

const sanitizeCreateData = (
  data: CreateTransferDTO,
  requesterRole?: string,
): Partial<CreateTransferDTO> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Create data is required");
  }
  return { ...data };
};

const sanitizeUpdateData = (
  data: UpdateTransferDTO,
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

export interface FetchTransfersQuery {
  page?: number;
  limit?: number;
}

export class TransferService {
  static async createTransfer(
    data: CreateTransferDTO,
    requesterRole: string,
  ): Promise<Transfer> {
    const createData = sanitizeCreateData(data, requesterRole);
    if (!createData.source || !createData.destination) {
      throw new BadRequestError("Transfer source and destination are required");
    }
    const source = createData.source;
    const destination = createData.destination;
    if (
      source.locationId === destination.locationId &&
      source.locationType === destination.locationType
    ) {
      throw new BadRequestError("Source and destination must be different");
    }
    if (!createData.items?.length) {
      throw new BadRequestError("A transfer must contain at least one item");
    }

    const changes = createData.items.map((item) => ({
      product: String(item.product),
      quantity: Number(item.quantity),
    }));
    await applyLocationStockChange(
      source.locationType,
      source.locationId,
      changes,
      -1,
    );
    await applyLocationStockChange(
      destination.locationType,
      destination.locationId,
      changes,
      1,
    );
    await applyProductStockChange(
      changes,
      source.locationType,
      source.locationId,
      0,
      -1,
    );
    await applyProductStockChange(
      changes,
      destination.locationType,
      destination.locationId,
      0,
      1,
    );
    invalidateProductCache();
    invalidateShopCache();
    invalidateWarehouseCache();

    const transferDoc = new TransferModel(createData);

    await transferDoc.save();

    const savedTransfer = await TransferModel.findById(transferDoc._id)
      .populate(PRODUCT_PROFILE_POPULATE)
      .lean();

    const hydratedTransfer = await hydrateLocationRefs(
      savedTransfer ?? transferDoc.toObject(),
    );

    invalidateTransferCache();
    return toTransfer(hydratedTransfer);
  }

  // Pure service method decoupled from Express Request
  static async fetchTransfers(
    queryParams: FetchTransfersQuery,
  ): Promise<TransferListResponse> {
    const page = Math.max(1, queryParams.page || 1);
    const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
    const skip = (page - 1) * limit;

    const cacheKey = `transfers_p${page}_l${limit}`;

    const cachedData = TransferCache.get<TransferListResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Build dynamic MongoDB filter query
    const filter: Record<string, any> = {};

    const [transfers, totalTransfers] = await Promise.all([
      TransferModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate(PRODUCT_PROFILE_POPULATE)
        .lean(),
      TransferModel.countDocuments(filter),
    ]);

    const hydratedTransfers = await Promise.all(
      transfers.map((transfer) => hydrateLocationRefs(transfer)),
    );

    const responseData: TransferListResponse = {
      inventoryTransfers: hydratedTransfers as unknown as Transfer[],
      totalInventoryTransfers: totalTransfers,
      currentPage: page,
      totalPages: Math.ceil(totalTransfers / limit) || 1,
    };

    TransferCache.set(cacheKey, responseData);
    return responseData;
  }

  static async fetchTransferById(
    transferId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Transfer> {
    assertTransferId(transferId);

    const cacheKey = `transfer_detail_${transferId}`;
    const cachedTransfer = TransferCache.get<Transfer>(cacheKey);
    if (cachedTransfer) return cachedTransfer;

    const transfer = await TransferModel.findById(transferId)
      .populate(PRODUCT_PROFILE_POPULATE)
      .lean();

    if (!transfer) {
      throw new NotFoundError("Transfer not found!");
    }

    const hydratedTransfer = await hydrateLocationRefs(transfer);
    const result = toTransfer(hydratedTransfer);

    TransferCache.set(cacheKey, result);
    return result;
  }

  static async updateTransfer(
    transferId: string,
    data: UpdateTransferDTO,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Transfer> {
    assertTransferId(transferId);

    const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);

    const transfer = await TransferModel.findByIdAndUpdate(
      transferId,
      { $set: flattenedUpdateData },
      { new: true, runValidators: true },
    )
      .populate(PRODUCT_PROFILE_POPULATE)
      .lean();

    if (!transfer) {
      throw new NotFoundError("Transfer not found!");
    }

    const hydratedTransfer = await hydrateLocationRefs(transfer);
    invalidateTransferCache();
    return toTransfer(hydratedTransfer);
  }

  static async deleteTransfer(
    transferId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Transfer> {
    assertTransferId(transferId);

    const transfer = await TransferModel.findByIdAndDelete(transferId)
      .populate(PRODUCT_PROFILE_POPULATE)
      .lean();

    if (!transfer) {
      throw new NotFoundError("Transfer not found!");
    }

    const hydratedTransfer = await hydrateLocationRefs(transfer);
    invalidateTransferCache();
    return toTransfer(hydratedTransfer);
  }
}
