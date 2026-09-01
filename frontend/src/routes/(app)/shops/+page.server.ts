import { env } from '$env/dynamic/public';
import type { ShopListResponse } from '$lib/types/shop.types';
import type { PageServerLoad } from './$types';
import { authCookies } from '$lib/config/auth';

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const type = url.searchParams.get('type') || '';

    const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(type && { type })
    });

    try {
        const accessToken = cookies.get(authCookies.accessToken);

        const response = await fetch(
            `${env.PUBLIC_SERVER_URL}/shop/get-shops?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                shops: [],
                totalShops: 0,
                currentPage: 1,
                totalPages: 1,
                error: errorData.message || 'Failed to load shops list.'
            };
        }

        const json = await response.json();
        const data: ShopListResponse = json.data;

        return {
            shops: data.shops ?? [],
            totalShops: data.totalShops ?? 0,
            currentPage: data.currentPage ?? 1,
            totalPages: data.totalPages ?? 1,
            error: null
        };
    } catch (error) {
        console.error('Error loading shops:', error);
        return {
            shops: [],
            totalShops: 0,
            currentPage: 1,
            totalPages: 1,
            error: 'Server is currently unreachable.'
        };
    }
};