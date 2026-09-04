import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { shopService } from '$lib/services/shop/shop.service';
import { transferService } from '$lib/services/transfers/transfer.service';
import { warehouseService } from '$lib/services/warehouse/warehouse.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const transfers = await transferService.fetch({
			cookies,
			locals
		});
		const [shops, warehouses] = await Promise.all([
			shopService.fetch({ cookies, locals }),
			warehouseService.fetch({ cookies, locals })
		]);

		return {
			transfers,
			shops,
			warehouses,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				transfers: [],
				shops: [],
				warehouses: [],
				error: err.message
			};
		}

		console.error('Failed to fetch transfers:', err);

		return {
			transfers: [],
			shops: [],
			warehouses: [],
			error: 'Failed to load transfers.'
		};
	}
};
