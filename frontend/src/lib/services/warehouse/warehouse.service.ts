import { apiClient } from '$lib/services/api/client';
import type {
	CreateWarehouseInput,
	Warehouse,
	WarehouseListResponse
} from '$lib/types/warehouse.types';
import type { ServiceContext } from '../api/types';

export const warehouseService = {
	async fetch(context: ServiceContext): Promise<Warehouse[]> {
		const response = await apiClient.get<WarehouseListResponse>(
			'/warehouse/get-warehouses',
			context
		);
		return response.warehouses ?? [];
	},

	async get(context: ServiceContext, id: string): Promise<Warehouse> {
		return apiClient.get<Warehouse>(`/warehouse/get-warehouse/${id}`, context);
	},

	async create(context: ServiceContext, input: CreateWarehouseInput): Promise<Warehouse> {
		return apiClient.post<Warehouse>('/warehouse/create-warehouse', input, context);
	},

	async update(
		context: ServiceContext,
		id: string,
		input: CreateWarehouseInput
	): Promise<Warehouse> {
		return apiClient.put<Warehouse>(`/warehouse/update-warehouse/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/warehouse/delete-warehouse/${id}`, undefined, context);
	}
};
