import { error } from '@sveltejs/kit';

import { expensesData } from '$lib/data/expenses.data';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const expense = expensesData.find((expense) => expense._id === params.id);

	if (!expense) {
		throw error(404, 'expense not found');
	}

	return {
		expense
	};
};
