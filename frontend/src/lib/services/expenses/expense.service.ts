import { apiClient } from '$lib/services/api/client';
import type {
	CreateExpenseInput,
	Expense,
	ExpenseListResponse
} from '$lib/services/expenses/expense.types';
import type { ServiceContext } from '../api/types';

export const expenseService = {
	async fetch(context: ServiceContext): Promise<Expense[]> {
		const pageSize = 100;
		const firstPage = await apiClient.get<ExpenseListResponse>(
			`/expense/get-expenses?page=1&limit=${pageSize}`,
			context
		);

		if (firstPage.totalPages <= 1) return firstPage.expenses ?? [];

		const remainingPages = await Promise.all(
			Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
				apiClient.get<ExpenseListResponse>(
					`/expense/get-expenses?page=${index + 2}&limit=${pageSize}`,
					context
				)
			)
		);

		return [
			...(firstPage.expenses ?? []),
			...remainingPages.flatMap((page) => page.expenses ?? [])
		];
	},

	async get(context: ServiceContext, id: string): Promise<Expense> {
		return apiClient.get<Expense>(`/expense/get-expense/${id}`, context);
	},

	async create(context: ServiceContext, input: CreateExpenseInput): Promise<Expense> {
		return apiClient.post<Expense>('/expense/create-expense', input, context);
	},

	async update(context: ServiceContext, id: string, input: CreateExpenseInput): Promise<Expense> {
		return apiClient.put<Expense>(`/expense/update-expense/${id}`, input, context);
	},

	async delete(context: ServiceContext, id: string): Promise<void> {
		return apiClient.delete<void>(`/expense/delete-expense/${id}`, undefined, context);
	}
};
