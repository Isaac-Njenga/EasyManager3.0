import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { saleService } from '$lib/services/sales/sales.service';
import { expenseService } from '$lib/services/expenses/expense.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const sales = saleService.fetch({
			cookies,
			locals
		});
		const expenses = expenseService.fetch({
			cookies,
			locals
		});

		const [salesData, expensesData] = await Promise.all([sales, expenses]);

		return {
			sales: salesData,
			expenses: expensesData,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				sales: [],
				error: err.message
			};
		}

		console.error('Failed to fetch data:', err);

		return {
			sales: [],
			error: 'Failed to load data'
		};
	}
};
