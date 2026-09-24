import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { logsService } from '$lib/services/logs/logs.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	try {
		return { result: await logsService.fetch({ cookies, locals }), error: null };
	} catch (err) {
		if (err instanceof ApiError) return { result: null, error: err.message };
		return { result: null, error: 'Logs are temporarily unavailable. Please try again.' };
	}
};
