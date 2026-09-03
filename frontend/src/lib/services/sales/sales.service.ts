import { apiClient } from '$lib/services/api/client';
import type { CreateSaleInput, Sale, SaleListResponse } from '$lib/services/sales/sales.types';
import type { ServiceContext } from '../api/types';

export const saleService = {
	async fetch(context: ServiceContext): Promise<Sale[]> {
		const response = await apiClient.get<SaleListResponse>('/sale/get-sales', context);
		return response.sales ?? [];
	},

	async get(context: ServiceContext, id: string): Promise<Sale> {
		return apiClient.get<Sale>(`/sale/get-sale/${id}`, context);
	},

	async create(context: ServiceContext, input: CreateSaleInput): Promise<Sale> {
		return apiClient.post<Sale>('/sale/create-sale', input, context);
	},

	async update(context: ServiceContext, id: string, input: CreateSaleInput): Promise<Sale> {
		return apiClient.put<Sale>(`/sale/update-sale/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/sale/delete-sale/${id}`, undefined, context);
	}
};
