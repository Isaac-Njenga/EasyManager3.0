export type WebProduct = {
	_id: string;
	image: string[];
	name: string;
	price: number;
	discount: number;
	category?: string;
	description?: string;
	inStock?: boolean;
};

export type CreateWebProductInput = { name: string };
