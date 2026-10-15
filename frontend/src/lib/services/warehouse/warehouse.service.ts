import { apiClient } from '$lib/services/api/client';
import type {
	CreateWarehouseInput,
	Warehouse,
	WarehouseListResponse,
	WarehouseDistributionInput,
	InventoryAdjustmentInput
} from '$lib/services/warehouse/warehouse.types';
import type { ServiceContext } from '../api/types';

export const warehouseService = {
	async fetch(context: ServiceContext): Promise<Warehouse[]> {
		const response = await apiClient.get<WarehouseListResponse>(
			'/warehouse/get-warehouses',
			context
		);
		return response.warehouses ?? [];
	},

	async fetchAll(context: ServiceContext): Promise<Warehouse[]> {
		const pageSize = 100;
		const firstPage = await apiClient.get<WarehouseListResponse>(
			`/warehouse/get-warehouses?page=1&limit=${pageSize}`,
			context
		);
		const pages = await Promise.all(
			Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, index) =>
				apiClient.get<WarehouseListResponse>(
					`/warehouse/get-warehouses?page=${index + 2}&limit=${pageSize}`,
					context
				)
			)
		);
		const warehouses = [
			...(firstPage.warehouses ?? []),
			...pages.flatMap((page) => page.warehouses ?? [])
		];
		return [...new Map(warehouses.map((warehouse) => [warehouse._id, warehouse])).values()];
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

	async distributionUpdate(
		context: ServiceContext,
		id: string,
		input: WarehouseDistributionInput
	): Promise<Warehouse> {
		return apiClient.put<Warehouse>(`/warehouse/distribute-inventory/${id}`, input, context);
	},

	async adjustInventory(
		context: ServiceContext,
		id: string,
		input: InventoryAdjustmentInput
	): Promise<Warehouse> {
		return apiClient.put<Warehouse>(`/warehouse/adjust-inventory/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/warehouse/delete-warehouse/${id}`, undefined, context);
	}
};
