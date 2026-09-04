import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { warehouseService } from '$lib/services/warehouse/warehouse.service';
import { productService } from '$lib/services/product/product.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const warehouse = warehouseService.get({ cookies, locals }, id);
		const products = productService.fetch({
			cookies,
			locals
		});

		const [warehouseData, productsData] = await Promise.all([warehouse, products]);

		return {
			warehouse: warehouseData,
			products: productsData,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading warehouse ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
