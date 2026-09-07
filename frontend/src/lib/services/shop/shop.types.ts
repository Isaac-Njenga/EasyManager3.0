import type { Product } from '../product/product.types';

export type ShopStatus = 'Active' | 'Inactive' | 'Under Maintenance';

export type ShopType = 'Retail Store' | 'Showroom';

export type ShopAddress = {
	building?: string;
	town: string;
};

export type ShopInventorySummary = {
	totalProducts: number; // Count of distinct product SKUs assigned to this shop
	totalItemsInStock: number; // Sum of stock quantities across all products
	totalStockValue: number; // Calculated monetary value of current shop stock (KES)
	lowStockItemsCount: number; // Items below minimum safety threshold
};

export type ShopInventoryItem = {
	_id?: string;
	product: Product | string;
	quantity: number;
};

export type Shop = {
	_id: string;
	shopCode: string; // Unique Identifier, e.g., "SHP-NRB-001"
	name: string; // e.g., "Westlands Showroom"
	type: ShopType;
	status: ShopStatus;
	address: ShopAddress;
	inventorySummary?: ShopInventorySummary;
	inventoryItems?: ShopInventoryItem[];
	notes?: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateShopInput = {
	name: string;
	type: ShopType;
	status: ShopStatus;
	address: ShopAddress;
	notes?: string;
};

export type ShopListResponse = {
	shops: Shop[];
	totalShops: number;
	currentPage: number;
	totalPages: number;
};

type InventoryItem = {
	product: string;
	quantity: number;
};
export interface ShopDistributionInput {
	inventoryItems: InventoryItem[];
}
