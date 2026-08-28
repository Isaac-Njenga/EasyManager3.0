import { redirect } from '@sveltejs/kit';
import { authCookies } from '$lib/config/auth';

export function load({ cookies }) {
	if (!cookies.get(authCookies.accessToken)) {
		throw redirect(303, '/login');
	}
}
