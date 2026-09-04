import { apiClient } from '$lib/services/api/client';
import type { CreateShopInput, Shop, ShopListResponse } from './shop.types';
import type { ServiceContext } from '../api/types';

export const shopService = {
	async fetch(context: ServiceContext): Promise<Shop[]> {
		const response = await apiClient.get<ShopListResponse>('/shop/get-shops', context);
		return response.shops ?? [];
	},

	async get(context: ServiceContext, id: string): Promise<Shop> {
		return apiClient.get<Shop>(`/shop/get-shop/${id}`, context);
	},

	async create(context: ServiceContext, input: CreateShopInput): Promise<Shop> {
		return apiClient.post<Shop>('/shop/create-shop', input, context);
	},

	async update(context: ServiceContext, id: string, input: CreateShopInput): Promise<Shop> {
		return apiClient.put<Shop>(`/shop/update-shop/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/shop/delete-shop/${id}`, undefined, context);
	}
};
