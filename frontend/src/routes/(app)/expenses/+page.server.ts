import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { expenseService } from '$lib/services/expenses/expense.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const expenses = await expenseService.fetch({
			cookies,
			locals
		});

		return {
			expenses,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				expenses: [],
				error: err.message
			};
		}

		console.error('Failed to fetch expenses:', err);

		return {
			expenses: [],
			error: 'Failed to load expenses.'
		};
	}
};
