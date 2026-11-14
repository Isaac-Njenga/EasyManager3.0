import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { CategoryService } from '$lib/services/website/categories/categories.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const categories = await CategoryService.get({ cookies, locals });

		return { categories, error: null };
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				categories: [],
				error: err.message
			};
		}

		console.error('Failed to fetch items:', err);

		return {
			categories: [],
			error: 'Failed to load items.'
		};
	}
};
