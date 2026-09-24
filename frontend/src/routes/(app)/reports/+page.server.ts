import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { expenseService } from '$lib/services/expenses/expense.service';
import { productService } from '$lib/services/product/product.service';
import { saleService } from '$lib/services/sales/sales.service';
import { shopService } from '$lib/services/shop/shop.service';
import { transferService } from '$lib/services/transfers/transfer.service';
import { warehouseService } from '$lib/services/warehouse/warehouse.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	const context = { cookies, locals };

	try {
		const [sales, products, expenses, shops, warehouses, transfers] = await Promise.all([
			saleService.fetch(context),
			productService.fetch(context),
			expenseService.fetch(context),
			shopService.fetch(context),
			warehouseService.fetch(context),
			transferService.fetch(context)
		]);

		return { sales, products, expenses, shops, warehouses, transfers };
	} catch (err) {
		if (err instanceof ApiError) error(err.status, err.message);

		console.error('Error loading reports:', err);
		error(500, 'Unable to load report data');
	}
};
