import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { shopService } from '$lib/services/shop/shop.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const shops = await shopService.fetch({
			cookies,
			locals
		});

		return {
			shops,
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


