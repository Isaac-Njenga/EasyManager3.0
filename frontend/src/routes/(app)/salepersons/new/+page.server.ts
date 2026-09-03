import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { shopService } from '$lib/services/shop/shop.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const shops = await shopService.fetch({
			cookies,
			locals
		});

		return {
			shops: shops,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading shops:`, err);
		error(500, 'Server is currently unreachable');
	}
};
