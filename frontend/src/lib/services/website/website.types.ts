export type WebProduct = {
	_id: string;
	image: string[];
	name: string;
	price: number;
	discount: number;
	category?: string;
	description?: string;
	colours: string[];
	keyFeatures: string[];
	tags: string[];
	inStock?: boolean;
	isBestSeller?: boolean;
	isNewArrival?: boolean;
};

export type CreateWebProductInput = {
	name: string;
	image: string[];
	price: number;
	discount?: number;
	category: string;
	description: string;
	colours: string[];
	keyFeatures: string[];
	tags: string[];
	inStock?: boolean;
	isBestSeller?: boolean;
	isNewArrival?: boolean;
};

export type CreateDescriptionInput = {
	name: string;
	price: number;
	category: string;
	colours: string[];
};

export type WebProductCategory =
	| 'Office Furniture'
	| 'Kitchen Furniture'
	| 'Living Room Furniture'
	| 'Outdoor Furniture'
	| 'Second-hand Furniture'
	| 'Second-Hand Items'
	| 'Bedroom Furniture';

// export type WebProductStatus = 'In Stock' | 'Out of Stock';

export type WebProductListResponse = {
	webProducts: WebProduct[];
	totalWebProducts: number;
	currentPage: number;
	totalPages: number;
};

export type GeneratedDescriptionResponse = {
	description: string;
	keyFeatures: string[];
	tags: string[];
};

