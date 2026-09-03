import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { salespersonService } from '$lib/services/salesperson/salesperson.service';
import { productService } from '$lib/services/product/product.service';
import { shopService } from '$lib/services/shop/shop.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const salespersons = salespersonService.fetch({ cookies, locals });
		const shops = shopService.fetch({ cookies, locals });
		const products = productService.fetch({
			cookies,
			locals
		});

		const [salespersonData, shopData, productsData] = await Promise.all([
			salespersons,
			shops,
			products
		]);

		return { shops: shopData, salespersons: salespersonData, products: productsData, error: null };
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading data:`, err);
		error(500, 'Server is currently unreachable');
	}
};
