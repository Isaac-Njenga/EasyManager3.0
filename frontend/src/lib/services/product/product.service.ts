import { apiClient } from '$lib/services/api/client';
import type { CreateProductInput, Product, ProductListResponse } from './product.types';
import type { ServiceContext } from '../api/types';

export const productService = {
	async fetch(context: ServiceContext): Promise<Product[]> {
		const pageSize = 100;
		const firstPage = await apiClient.get<ProductListResponse>(
			`/product/get-products?page=1&limit=${pageSize}`,
			context
		);

		if (firstPage.totalPages <= 1) {
			return firstPage.products ?? [];
		}

		const remainingPages = await Promise.all(
			Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
				apiClient.get<ProductListResponse>(
					`/product/get-products?page=${index + 2}&limit=${pageSize}`,
					context
				)
			)
		);

		return [
			...(firstPage.products ?? []),
			...remainingPages.flatMap((page) => page.products ?? [])
		];
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
