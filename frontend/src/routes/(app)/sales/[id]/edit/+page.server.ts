import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { saleService } from '$lib/services/sales/sales.service';
import { salespersonService } from '$lib/services/salesperson/salesperson.service';
import { productService } from '$lib/services/product/product.service';
import { shopService } from '$lib/services/shop/shop.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const sale = saleService.get({ cookies, locals }, id);
		const salespersons = salespersonService.fetch({ cookies, locals });
		const shops = shopService.fetch({ cookies, locals });
		const products = productService.fetch({
			cookies,
			locals
		});

		const [shopData, saleData, salespersonData, productsData] = await Promise.all([
			shops,
			sale,
			salespersons,
			products
		]);
		return {
			sale: saleData,
			salespersons: salespersonData,
			products: productsData,
			shops: shopData,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading data: ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
