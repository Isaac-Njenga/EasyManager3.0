import { error } from '@sveltejs/kit';

import { salesData } from '$lib/data/sales.data';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const sale = salesData.find((sale) => sale._id === params.id);

	if (!sale) {
		throw error(404, 'Sale not found');
		// toast.error('Product not found. Refresh the page and try again');
	}

	return {
		sale
	};
};
