export type ProductStatus = 'Active' | 'Inactive';

export interface LocationStock {
	locationId: string; // Mongo ID referencing Warehouse or Shop
	locationType: 'Warehouse' | 'Shop';
	quantity: number;
}

export type Product = {
	_id: string;
	name: string;
	sku: string;
	code: string;
	colour: string;
	image: string[];
	description?: string;
	category: string;
	costPrice: number;
	sellingPrice: number;
	totalQuantity: number;
	status: ProductStatus;
	inventory: LocationStock[];
	createdAt: string;
	updatedAt: string;
};
