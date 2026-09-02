import type { PageServerLoad } from './$types';

import { ApiError } from '$lib/services/api/errors';
import { warehouseService } from '$lib/services/warehouse/warehouse.service';

export const load: PageServerLoad = async ({ cookies, locals }) => {
    try {
        const warehouses = await warehouseService.fetch({
            cookies,
            locals
        });

        return {
            warehouses,
            error: null
        };
    } catch (err) {
        if (err instanceof ApiError) {
            return {
                warehouses: [],
                error: err.message
            };
        }

        console.error('Failed to fetch warehouses:', err);

        return {
            warehouses: [],
            error: 'Failed to load warehouses.'
        };
    }
};


