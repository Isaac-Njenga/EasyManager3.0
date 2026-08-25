import { error } from '@sveltejs/kit';

import { shopsData } from '$lib/data/shop.data';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const shop = shopsData.find((shop) => shop._id === params.id);

    if (!shop) {
        throw error(404, 'Shop not found');
    }

    return {
        shop
    };
};
