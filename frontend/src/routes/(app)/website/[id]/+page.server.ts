import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { webProductService } from '$lib/services/website/website.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const webProduct = webProductService.get({ cookies, locals }, id);
		return { webProduct, error: null };
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading webproduct ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};
