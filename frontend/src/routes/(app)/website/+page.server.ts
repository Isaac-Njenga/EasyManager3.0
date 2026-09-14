import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { webProductService } from '$lib/services/website/website.service';

export const load: PageServerLoad = async () => {
	try {
		const webProducts = await webProductService.fetch();

		return { webProducts, error: null };
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				webProducts: [],
				error: err.message
			};
		}

		console.error('Failed to fetch items:', err);

		return {
			warehouses: [],
			error: 'Failed to load items.'
		};
	}
};
