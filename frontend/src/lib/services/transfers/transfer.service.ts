import { apiClient } from '$lib/services/api/client';
import type {
	CreateTransferInput,
	InventoryTransfer as Transfer,
	TransferListResponse
} from './transfer.types';
import type { ServiceContext } from '../api/types';

export const transferService = {
	async fetch(context: ServiceContext): Promise<Transfer[]> {
		const response = await apiClient.get<TransferListResponse>('/transfer/get-transfers', context);
		return response.inventoryTransfers ?? [];
	},

	async get(context: ServiceContext, id: string): Promise<Transfer> {
		return apiClient.get<Transfer>(`/transfer/get-transfer/${id}`, context);
	},

	async create(context: ServiceContext, input: CreateTransferInput): Promise<Transfer> {
		return apiClient.post<Transfer>('/transfer/create-transfer', input, context);
	},

	async update(context: ServiceContext, id: string, input: CreateTransferInput): Promise<Transfer> {
		return apiClient.put<Transfer>(`/transfer/update-transfer/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/transfer/delete-transfer/${id}`, undefined, context);
	}
};
