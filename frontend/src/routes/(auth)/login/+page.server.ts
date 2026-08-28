import { env } from '$env/dynamic/public';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const password = formData.get('password');

		if (typeof userId !== 'string' || typeof password !== 'string') {
			return fail(400, { error: 'User ID and password are required.' });
		}

		try {
			const response = await fetch(`${env.PUBLIC_SERVER_URL}/auth/sign-in`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ userId, password })
			});

			const data = await response.json();

			if (!response.ok) {
				return fail(response.status, { error: data.message ?? 'Unable to sign in.' });
			}

			return {
				token: data.token,
				refreshToken: data.refreshToken,
				user: data.user
			};
		} catch {
			return fail(503, { error: 'The server is unavailable. Please try again.' });
		}
	}
};
