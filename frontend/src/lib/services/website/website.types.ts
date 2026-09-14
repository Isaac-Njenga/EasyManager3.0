export type WebProduct = {
	_id: string;
	image: string[];
	name: string;
	price: number;
	discount: number;
	category?: string;
	description?: string;
	colours: string[];
	inStock?: boolean;
};

export type CreateWebProductInput = {
	name: string;
	image: string[];
	price: number;
	discount: number;
	category?: string;
	description?: string;
	colours: string[];
	inStock?: boolean;
};

export type WebProductCategory =
	| 'Office Furniture'
	| 'Kitchen Furniture'
	| 'Living Room Furniture'
	| 'Outdoor Furniture'
	| 'Second-hand Furniture'
	| 'Second-Hand Items'
	| 'Bedroom Furniture';
