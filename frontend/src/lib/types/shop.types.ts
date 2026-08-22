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

export type Shop = {
	_id: string;
	shopCode: string; // Unique Identifier, e.g., "SHP-NRB-001"
	name: string; // e.g., "Westlands Showroom"
	type: ShopType;
	status: ShopStatus;
	address: ShopAddress;
	inventorySummary?: ShopInventorySummary;
	notes?: string;
	createdAt: string;
	updatedAt: string;
};
