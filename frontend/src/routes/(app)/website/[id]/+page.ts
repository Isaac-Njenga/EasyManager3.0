import { error } from '@sveltejs/kit';

import { webProductsData } from '$lib/data/website.data';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const webProduct = webProductsData.find((product) => product._id === params.id);

    if (!webProduct) {
        throw error(404, 'Product not found');
    }

    return {
        webProduct
    };
};
