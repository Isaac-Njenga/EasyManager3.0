import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { saleService } from '$lib/services/sales/sales.service';
import { expenseService } from '$lib/services/expenses/expense.service';
import { productService } from '$lib/services/product/product.service';
import { webProductService } from '$lib/services/website/website.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const context = {
			cookies,
			locals
		};
		const sales = saleService.fetch(context);
		const expenses = expenseService.fetch(context);
		const products = productService.fetch(context);
		const webProducts = webProductService.fetch();

		const [salesData, expensesData, productsData, webProductsData] = await Promise.all([
			sales,
			expenses,
			products,
			webProducts
		]);

		return {
			sales: salesData,
			expenses: expensesData,
			products: productsData,
			webProducts: webProductsData,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				sales: [],
				expenses: [],
				products: [],
				webProducts: [],
				error: err.message
			};
		}

		console.error('Failed to fetch data:', err);

		return {
			sales: [],
			expenses: [],
			products: [],
			webProducts: [],
			error: 'Failed to load data'
		};
	}
};
