import { apiClient } from '$lib/services/api/client';
import type { CreateProductInput, Product, ProductListResponse } from './product.types';
import type { ServiceContext } from '../api/types';

export const productService = {
	async fetch(context: ServiceContext): Promise<Product[]> {
		const response = await apiClient.get<ProductListResponse>('/product/get-products', context);
		return response.products ?? [];
	},

	async get(context: ServiceContext, id: string): Promise<Product> {
		return apiClient.get<Product>(`/product/get-product/${id}`, context);
	},

	async create(context: ServiceContext, input: CreateProductInput): Promise<Product> {
		return apiClient.post<Product>('/product/create-product', input, context);
	},

	async update(context: ServiceContext, id: string, input: CreateProductInput): Promise<Product> {
		return apiClient.put<Product>(`/product/update-product/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/product/delete-product/${id}`, undefined, context);
	}
};
