import { apiClient } from '$lib/services/api/client';
import type {
	CreateWebProductInput,
	WebProduct,
	WebProductListResponse,
	CreateDescriptionInput,
	GeneratedDescriptionResponse,
	CatalogCategory
} from './website.types';
import type { ServiceContext } from '../api/types';

export const CatalogProductService = {
	async categories(context: ServiceContext): Promise<CatalogCategory[]> {
		return apiClient.get<CatalogCategory[]>('/category', context);
	},
	async fetch(page = 1, limit = 10): Promise<WebProductListResponse> {
		return apiClient.get<WebProductListResponse>(
			`/catalog/get-catalog-products?page=${page}&limit=${limit}`
		);
	},

	async fetchAll(context: ServiceContext): Promise<WebProduct[]> {
		const response = await apiClient.get<WebProductListResponse>(
			'/catalog/get-all-catalog-products',
			context
		);
		return response.catalog ?? [];
	},

	async get(context: ServiceContext, id: string): Promise<WebProduct> {
		return apiClient.get<WebProduct>(`/catalog/get-catalog-product-by-id/${id}`, context);
	},

	async create(context: ServiceContext, input: CreateWebProductInput): Promise<WebProduct> {
		return apiClient.post<WebProduct>('/catalog/create-catalog-product', input, context);
	},

	async update(
		context: ServiceContext,
		id: string,
		input: CreateWebProductInput
	): Promise<WebProduct> {
		return apiClient.put<WebProduct>(`/catalog/update-catalog-product/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/catalog/delete-catalog-product/${id}`, undefined, context);
	},
	async description(
		context: ServiceContext,
		input: CreateDescriptionInput
	): Promise<GeneratedDescriptionResponse> {
		return apiClient.post<GeneratedDescriptionResponse>(
			'/cohere-model/generate-description',
			input,
			context
		);
	}
};
