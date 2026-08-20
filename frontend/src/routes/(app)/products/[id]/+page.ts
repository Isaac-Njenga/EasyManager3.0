import { error } from '@sveltejs/kit';

import { productsData } from '$lib/data/products.data';

import type { PageLoad } from './$types';
import { toast } from 'svelte-sonner';

export const load: PageLoad = ({ params }) => {
	const product = productsData.find((product) => product._id === params.id);

	if (!product) {
		throw error(404, 'Product not found');
		toast.error('Product not found. Refresh the page and try again');
	}

	return {
		product
	};
};
