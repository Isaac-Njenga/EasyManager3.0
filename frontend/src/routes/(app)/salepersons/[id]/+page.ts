import { error } from '@sveltejs/kit';

import { salespersonsData } from '$lib/data/saleperson.data';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const saleperson = salespersonsData?.find((sPerson) => sPerson._id === params.id);

	if (!saleperson) {
		throw error(404, 'Saleperson not found');
	}

	return {
		saleperson
	};
};
