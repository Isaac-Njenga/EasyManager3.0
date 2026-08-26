import type { Product } from './product.types';

export type TransferType =
	'inter_warehouse' | 'store_replenishment' | 'return_to_hub' | 'inter_shop';

export type LocationType = 'warehouse' | 'shop';

export interface TransferLocation {
	id: string;
	name: string;
	type: LocationType;
}

export interface InventoryTransfer {
	_id: string;
	transferNumber: string;
	type: TransferType;
	// Grouped location entities
	source: TransferLocation;
	destination: TransferLocation;

	items: Product[];
	totalItemsCount: number;

	date: string;

	notes?: string;
	createdAt: string;
	updatedAt: string;
}
