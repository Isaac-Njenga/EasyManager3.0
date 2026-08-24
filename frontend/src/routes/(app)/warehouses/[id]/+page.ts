import { error } from '@sveltejs/kit';

import { warehouseData } from '$lib/data/warehouses.data';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const warehouse = warehouseData.find((w) => w._id === params.id);

	if (!warehouse) {
		throw error(404, 'Warehouse not found');
	}
    
	return { warehouse };
};
