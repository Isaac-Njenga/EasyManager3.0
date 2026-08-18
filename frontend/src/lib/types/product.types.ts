export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export type Product = {
	_id: string;
	name: string;
	sku: string;
	code: string;
	colour: string;
	image: string[];
	description?: string;
	category: string;
	price: number;
	quantity: number;
	status: ProductStatus;
	location: string;
	createdAt: string;
	updatedAt: string;
};
