// export type CatalogCategory = {
// 	_id: string;
// 	name: string;
// 	slug: string;
// 	image?: string;
// 	status?: 'ACTIVE' | 'INACTIVE';
// };
import type {Category} from './categories/categories.types'
export type CatalogPricing = { currency: string; basePrice: number; compareAtPrice: number | null };
export type CatalogMerchandising = {
	isFeatured: boolean;
	isBestSeller: boolean;
	isNewArrival: boolean;
	sortOrder: number;
};
export type CatalogSEO = { metaTitle?: string; metaDescription?: string };
export type Catalog = {
	_id: string;
	name: string;
	slug: string;
	description: string;
	category: Category;
	images: string[];
	colours: string[];
	keyFeatures: string[];
	tags: string[];
	specifications: Record<string, string>;
	pricing: CatalogPricing;
	merchandising: CatalogMerchandising;
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
	seo: CatalogSEO;
	createdAt: string;
	updatedAt: string;
};
export type CreateWebProductInput = Omit<
	Catalog,
	'_id' | 'createdAt' | 'updatedAt' | 'category'
> & { category: string };
export type WebProduct = Catalog;
export type WebProductListResponse = {
	catalog: Catalog[];
	totalCatalog: number;
	currentPage: number;
	totalPages: number;
};
export type CreateDescriptionInput = {
	name: string;
	category: string;
	pricing: Pick<CatalogPricing, 'basePrice' | 'currency'>;
	colours: string[];
	keyFeatures?: string[];
	specifications?: Record<string, string>;
};
export type GeneratedDescriptionResponse = {
	description: string;
	keyFeatures: string[];
	tags: string[];
	slug: string;
	seo: Required<CatalogSEO>;
};

export type CatalogCategory =
	| 'Office Furniture'
	| 'Kitchen Furniture'
	| 'Living Room Furniture'
	| 'Outdoor Furniture'
	| 'Second-hand Furniture'
	| 'Second-Hand Items'
	| 'Bedroom Furniture';

export const categoryName = (category: Catalog['category']): string =>
	typeof category === 'string' ? category : (category?.name ?? '');

export const catalogDiscount = (product: Catalog): number => {
	const compare = product.pricing.compareAtPrice;
	return compare && compare > product.pricing.basePrice
		? Math.round((1 - product.pricing.basePrice / compare) * 100)
		: 0;
};

export function formatCatalogPrice(value: number, currency: string): string {
	try {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency,
			minimumFractionDigits: 0
		}).format(value);
	} catch {
		return `${currency} ${new Intl.NumberFormat('en-KE').format(value)}`;
	}
}
