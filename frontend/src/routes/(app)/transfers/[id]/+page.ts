import { error } from '@sveltejs/kit';

import { transferData } from '$lib/data/transfer.data';

import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
	const transfer = transferData.find((transfer) => transfer._id === params.id);

	if (!transfer) {
		throw error(404, 'Transfer not found');
	}

	return {
		transfer
	};
};
