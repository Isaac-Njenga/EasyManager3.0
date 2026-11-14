import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { CatalogProductService } from '$lib/services/website/website.service';
import { CategoryService } from '$lib/services/website/categories/categories.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const catalogProducts = await CatalogProductService.fetchAll({ cookies, locals });
		const categories = await CategoryService.get({ cookies, locals });

		return { catalogProducts, categories, error: null };
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				catalogProducts: [],
				categories: [],
				error: err.message
			};
		}

		console.error('Failed to fetch items:', err);

		return {
			catalogProducts: [],
			categories: [],
			error: 'Failed to load items.'
		};
	}
};
