import type { Product } from '$lib/services/product/product.types';
import type { Shop } from '$lib/services/shop/shop.types';
import type { Warehouse } from '$lib/services/warehouse/warehouse.types';

export type TransferType =
    | 'inter_warehouse'
    | 'store_replenishment'
    | 'return_to_hub'
    | 'inter_shop';

export type LocationType = 'Warehouse' | 'Shop';

// Populated entity union
export type LocationEntity = Shop | Warehouse;

// Generic Location structure
export interface TransferLocation<T = string> {
    locationType: LocationType;
	name?:string;
    locationId: T;
}

// Input type: string ID
export type TransferLocationInput = TransferLocation<string>;

// Output type: populated Shop or Warehouse object
export type TransferLocationPopulated = TransferLocation<LocationEntity>;

// Response interface (Populated)
export interface InventoryTransfer {
    _id: string;
    transferNumber: string;
    type: TransferType;
    source: TransferLocationPopulated;
    destination: TransferLocationPopulated;
    items: Product[];
    totalItemsCount: number;
    dateOfTransfer: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Request payload (Raw String IDs)
export type CreateTransferInput = {
    type: TransferType;
    source: TransferLocationInput;
    destination: TransferLocationInput;
    items: string[];
    totalItemsCount: number;
    dateOfTransfer: string;
    notes?: string;
};

export type TransferListResponse = {
    inventoryTransfers: InventoryTransfer[];
    totalInventoryTransfers: number;
    totalPages: number;
    currentPage: number;
};