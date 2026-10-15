import { apiClient } from '$lib/services/api/client';
import type {
	CreateShopInput,
	Shop,
	ShopListResponse,
	ShopDistributionInput,
	InventoryAdjustmentInput
} from './shop.types';
import type { ServiceContext } from '../api/types';

export const shopService = {
	async fetch(context: ServiceContext): Promise<Shop[]> {
		const response = await apiClient.get<ShopListResponse>('/shop/get-shops', context);
		return response.shops ?? [];
	},

	async fetchAll(context: ServiceContext): Promise<Shop[]> {
		const pageSize = 100;
		const firstPage = await apiClient.get<ShopListResponse>(
			`/shop/get-shops?page=1&limit=${pageSize}`,
			context
		);
		const pages = await Promise.all(
			Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, index) =>
				apiClient.get<ShopListResponse>(
					`/shop/get-shops?page=${index + 2}&limit=${pageSize}`,
					context
				)
			)
		);
		const shops = [...(firstPage.shops ?? []), ...pages.flatMap((page) => page.shops ?? [])];
		return [...new Map(shops.map((shop) => [shop._id, shop])).values()];
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

	async distributionUpdate(
		context: ServiceContext,
		id: string,
		input: ShopDistributionInput
	): Promise<Shop> {
		return apiClient.put<Shop>(`/shop/distribute-inventory/${id}`, input, context);
	},

	async adjustInventory(
		context: ServiceContext,
		id: string,
		input: InventoryAdjustmentInput
	): Promise<Shop> {
		return apiClient.put<Shop>(`/shop/adjust-inventory/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/shop/delete-shop/${id}`, undefined, context);
	}
};
