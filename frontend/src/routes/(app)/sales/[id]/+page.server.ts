import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { saleService } from '$lib/services/sales/sales.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const sale = await saleService.get({ cookies, locals }, id);

		return {
			sale,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading sale: ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
