import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { saleService } from '$lib/services/sales/sales.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const context = await saleService.getCreationContext({ cookies, locals });
		return { ...context, error: null };
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading data:`, err);
		error(500, 'Server is currently unreachable');
	}
};
