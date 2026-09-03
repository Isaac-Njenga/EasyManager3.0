import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { expenseService } from '$lib/services/expenses/expense.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const expense = await expenseService.get({ cookies, locals }, id);

		return {
			expense,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading expense ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
