import { Product } from "../Products/product.types";
import { Shop } from "../Shops/shop.types";
import { Warehouse } from "../Warehouses/warehouse.types";

export type TransferType =
  | "inter_warehouse"
  | "store_replenishment"
  | "return_to_hub"
  | "inter_shop";

export type LocationType = "Warehouse" | "Shop";

// Union for populated location documents
export type LocationEntity = Shop | Warehouse;

// Generic TransferLocation to handle both raw IDs and populated documents
export interface TransferLocation<T = string> {
  locationId: T;
  locationType: LocationType;
}

// Populated InventoryTransfer model ( returned after .populate() )
export interface InventoryTransfer {
  _id: string;
  transferNumber: string;
  type: TransferType;
  source: TransferLocation<LocationEntity>;
  destination: TransferLocation<LocationEntity>;
  items: Product[];
  totalItemsCount: number;
  dateOfTransfer: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs for incoming requests ( uses raw string ObjectIds )
export interface CreateInventoryTransferDTO {
  type: TransferType;
  source: TransferLocation<string>;
  destination: TransferLocation<string>;
  items: string[];
  totalItemsCount: number;
  dateOfTransfer: string;
  notes?: string;
}

export interface UpdateInventoryTransferDTO {
  type?: TransferType;
  source?: TransferLocation<string>;
  destination?: TransferLocation<string>;
  items?: string[];
  totalItemsCount?: number;
  dateOfTransfer?: string;
  notes?: string;
}

export interface InventoryTransferListResponse {
  inventoryTransfers: InventoryTransfer[];
  totalInventoryTransfers: number;
  totalPages: number;
  currentPage: number;
}