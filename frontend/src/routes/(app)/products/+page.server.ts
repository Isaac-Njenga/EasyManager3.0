import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { productService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const products = await productService.fetch({
			cookies,
			locals
		});

		return {
			products,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				products: [],
				error: err.message
			};
		}

		console.error('Failed to fetch products:', err);

		return {
			products: [],
			error: 'Failed to load products.'
		};
	}
};
