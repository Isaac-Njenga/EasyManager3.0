import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { shopService } from '$lib/services/shop/shop.service';
import { productService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const shops = shopService.fetch({
			cookies,
			locals
		});
		const products = productService.fetch({ cookies, locals });

		const [shopData, productData] = await Promise.all([shops, products]);

		return {
			shops: shopData,
			products: productData,
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
