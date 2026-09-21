export type ProductStatus = 'Active' | 'Inactive';

export type ProductLocation = {
	_id: string;
	name: string;
	status: string;
	warehouseCode?: string;
	shopCode?: string;
	type?: string;
};

export interface LocationStock {
	locationId: string | ProductLocation; // Populated Warehouse or Shop, or an ID before population
	locationType: 'Warehouse' | 'Shop';
	quantity: number;
}

export const getLocationId = (location: LocationStock['locationId']): string =>
	typeof location === 'string' ? location : location._id;

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
	inventory?: LocationStock[];
	inventoryDistribution?: LocationStock[];
	createdAt?: string;
	updatedAt?: string;
};

export type ProductListResponse = {
	products: Product[];
	totalProducts: number;
	currentPage: number;
	totalPages: number;
};

export type CreateProductInput = {
	name: string;
	sku?: string;
	code: string;
	colour?: string;
	image?: string[];
	description?: string;
	category: string;
	costPrice: number;
	sellingPrice: number;
	status: ProductStatus;
};

export type ProductCategory =
	| 'Chairs & Seats'
	| 'Desks & Tables'
	| 'Storage & Filing'
	| 'Space Dividers & Panels'
	| 'Second-hand Furniture'
	| 'Accessories & Ergonomics'
	| 'Outdoor & Breakroom';
