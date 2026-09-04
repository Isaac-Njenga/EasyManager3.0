import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { shopService } from '$lib/services/shop/shop.service';
import { productService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const shop = shopService.get({ cookies, locals }, id);
		const products = productService.fetch({ cookies, locals });

		const [shopData, productData] = await Promise.all([shop, products]);

		return {
			shop: shopData,
			products: productData,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading shop: ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
