import type { Product } from '../product/product.types';

export type WarehouseStatus = 'Active' | 'Inactive' | 'Under Maintenance' | 'Full Capacity';

export type WarehouseAddress = {
	building?: string;
	city: string;
};

export type WarehouseInventorySummary = {
	totalProducts: number; // Distinct SKUs
	totalItemsInStock: number; // Aggregate unit count
	totalStockValue: number; // Financial valuation in local currency
	lowStockItemsCount: number;
	outOfStockItemsCount: number;
};

export type WarehouseInventoryItem = {
	_id?: string;
	product: Product | string;
	quantity: number;
};

export type Warehouse = {
	_id: string;
	warehouseCode: string; // e.g. "WH-NRB-001"
	name: string; // e.g. "Central Logistics Hub - Embakasi"
	status: WarehouseStatus;
	address: WarehouseAddress;
	inventorySummary?: WarehouseInventorySummary;
	inventoryItems: WarehouseInventoryItem[];
	notes?: string;
	createdAt: string;
	updatedAt: string;
};

export interface WarehouseListResponse {
	warehouses: Warehouse[];
	totalWarehouses: number;
	currentPage: number;
	totalPages: number;
}

export interface CreateWarehouseInput {
	name: string;
	status: WarehouseStatus;
	address: WarehouseAddress;
	notes?: string;
}

type InventoryItem = {
	product: string;
	quantity: number;
};
export interface WarehouseDistributionInput {
	inventoryItems: InventoryItem[];
}
