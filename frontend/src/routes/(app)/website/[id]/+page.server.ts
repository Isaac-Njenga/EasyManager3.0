import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { CatalogProductService } from '$lib/services/website/website.service';
import { CategoryService } from '$lib/services/website/categories/categories.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const webProduct = CatalogProductService.get({ cookies, locals }, id);
		const categories = await CategoryService.get({ cookies, locals });

		return { webProduct, categories, error: null };
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading webproduct ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
