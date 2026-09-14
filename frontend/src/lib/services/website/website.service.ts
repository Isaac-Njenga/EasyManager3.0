import { apiClient } from '$lib/services/api/client';
import type { CreateWebProductInput, WebProduct, WebProductListResponse } from './website.types';
import type { ServiceContext } from '../api/types';

export const webProductService = {
	async fetch(): Promise<WebProduct[]> {
		const response = await apiClient.get<WebProductListResponse>('/web-product/get-web-products');
		return response.webProducts ?? [];
	},

	async get(context: ServiceContext, id: string): Promise<WebProduct> {
		return apiClient.get<WebProduct>(`/web-product/get-web-product/${id}`, context);
	},

	async create(context: ServiceContext, input: CreateWebProductInput): Promise<WebProduct> {
		return apiClient.post<WebProduct>('/web-product/create-web-product', input, context);
	},

	async update(
		context: ServiceContext,
		id: string,
		input: CreateWebProductInput
	): Promise<WebProduct> {
		return apiClient.put<WebProduct>(`/web-product/update-web-product/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/web-product/delete-web-product/${id}`, undefined, context);
	}
};
