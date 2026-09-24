import { redirect } from '@sveltejs/kit';
import { authCookies } from '$lib/config/auth';

export function load({ cookies, url }) {
	if (!cookies.get(authCookies.accessToken)) {
		throw redirect(303, '/login');
	}

	const userCookie = cookies.get(authCookies.user);
	let role: string | undefined;
	try {
		role = userCookie ? JSON.parse(userCookie).role : undefined;
	} catch {
		throw redirect(303, '/login');
	}

	// The server API remains the authority, but this prevents restricted pages
	// from loading or flashing for a salesperson who edits the URL directly.
	if (role === 'SALESPERSON' && url.pathname !== '/sales/new') {
		throw redirect(303, '/sales/new');
	}

	if (role !== 'SUPER_ADMIN' && role !== 'SALESPERSON') {
		throw redirect(303, '/login');
	}

	return { role };
}
