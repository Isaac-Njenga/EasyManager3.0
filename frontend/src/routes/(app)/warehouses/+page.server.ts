import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { warehouseService } from '$lib/services/warehouse/warehouse.service';
import { productService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const warehouses = warehouseService.fetch({
			cookies,
			locals
		});
		const products = productService.fetch({
			cookies,
			locals
		});

		const [warehouseData, productsData] = await Promise.all([warehouses, products]);

		return {
			warehouses: warehouseData,
			products: productsData,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				warehouses: [],
				error: err.message
			};
		}

		console.error('Failed to fetch warehouses:', err);

		return {
			warehouses: [],
			error: 'Failed to load warehouses.'
		};
	}
};
