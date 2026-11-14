import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { CatalogProductService } from '$lib/services/website/website.service';
import { CategoryService } from '$lib/services/website/categories/categories.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const CatalogProduct = CatalogProductService.get({ cookies, locals }, id);
		const categories = await CategoryService.get({ cookies, locals });

		return { CatalogProduct, categories, error: null };
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading product ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
