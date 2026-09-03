import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { salespersonService } from '$lib/services/salesperson/salesperson.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const { id } = params;

	try {
		const salesperson = await salespersonService.get({ cookies, locals }, id);

		return {
			salesperson,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			error(err.status, err.message);
		}

		console.error(`Error loading salesperson: ${id}:`, err);
		error(500, 'Server is currently unreachable');
	}
};