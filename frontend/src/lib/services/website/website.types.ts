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
	isBestSeller?: boolean;
    isNewArrival?: boolean;
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


// 	isBestSeller: { type: Boolean, default: false, index: true },
// isNewArrival: { type: Boolean, default: false, index: true }

// Storefront endpoint
// const bestSellers = await WebProduct.find({ isBestSeller: true }).limit(8);