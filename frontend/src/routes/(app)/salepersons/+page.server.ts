import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { salespersonService } from '$lib/services/salesperson/salesperson.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		const salespersons = await salespersonService.fetch({
			cookies,
			locals
		});

		return {
			salespersons,
			error: null
		};
	} catch (err) {
		if (err instanceof ApiError) {
			return {
				salespersons: [],
				error: err.message
			};
		}

		console.error('Failed to fetch salespersons:', err);

		return {
			salespersons: [],
			error: 'Failed to load salespersons.'
		};
	}
};
