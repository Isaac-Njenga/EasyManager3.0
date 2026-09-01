import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { shopService } from '$lib/services/shop/shop.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const shop = await shopService.get({ cookies, locals }, id);

		return {
			shop,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading shop ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
