import { apiClient } from '$lib/services/api/client';
import type {
	CreateSalespersonInput,
	Salesperson,
	SalespersonListResponse
} from '$lib/services/salesperson/salesperson.types';
import type { ServiceContext } from '../api/types';

export const salespersonService = {
	async fetch(context: ServiceContext): Promise<Salesperson[]> {
		const response = await apiClient.get<SalespersonListResponse>(
			'/salesperson/get-salespersons',
			context
		);
		return response.salespersons ?? [];
	},

	async get(context: ServiceContext, id: string): Promise<Salesperson> {
		return apiClient.get<Salesperson>(`/salesperson/get-salesperson/${id}`, context);
	},

	async create(context: ServiceContext, input: CreateSalespersonInput): Promise<Salesperson> {
		return apiClient.post<Salesperson>('/salesperson/create-salesperson', input, context);
	},

	async update(
		context: ServiceContext,
		id: string,
		input: CreateSalespersonInput
	): Promise<Salesperson> {
		return apiClient.put<Salesperson>(`/salesperson/update-salesperson/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/salesperson/delete-salesperson/${id}`, undefined, context);
	}
};
