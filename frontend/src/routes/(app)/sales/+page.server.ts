import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { saleService } from '$lib/services/sales/sales.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const sales = await saleService.fetch({
			cookies,
			locals
		});

		return {
			sales,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				shops: [],
				error: err.message
			};
		}

		console.error('Failed to fetch shops:', err);

		return {
			shops: [],
			error: 'Failed to load shops.'
		};
	}
};
