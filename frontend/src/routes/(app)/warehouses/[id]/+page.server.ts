import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ApiError } from '$lib/services/api/errors';
import { warehouseService } from '$lib/services/warehouse/warehouse.service';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
    const { id } = params;

    try {
        const warehouse = await warehouseService.get({ cookies, locals }, id);

        return {
            warehouse,
            error: null
        };
    } catch (err) {
        if (err instanceof ApiError) {
            error(err.status, err.message);
        }

        console.error(`Error loading warehouse ${id}:`, err);
        error(500, 'Server is currently unreachable');
    }
};
