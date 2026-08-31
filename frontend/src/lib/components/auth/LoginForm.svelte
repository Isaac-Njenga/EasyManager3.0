<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Cookies from 'universal-cookie';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { authCookies, type LoginResult } from '$lib/config/auth';
	import { toast } from 'svelte-sonner';

	let userId = $state('');
	let password = $state('');
	let isLoading = $state(false);
	// eslint-disable-next-line
	let errorMessage = $state('');

	const cookieOptions = {
		path: '/',
		sameSite: 'lax' as const,
		maxAge: 60 * 60 * 24 * 30,
		secure: false
	};

	const requiredFieldsConfig = [
		{ label: 'User ID', getValue: () => userId },
		{ label: 'Password', getValue: () => password }
	];

	async function handleSubmission(event: SubmitEvent) {
		event.preventDefault();

		const missingFields = requiredFieldsConfig
			.filter((field) => !field.getValue()?.toString().trim())
			.map((field) => field.label);

		if (missingFields.length > 0) {
			toast.error('Please fill in required fields', {
				description: `Missing: ${missingFields.join(', ')}`
			});
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const response = await fetch(`${env.PUBLIC_SERVER_URL}/auth/sign-in`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ userId, password })
			});

			const data = (await response.json().catch(() => ({}))) as {
				message?: string;
				error?: string;
				token?: string;
				refreshToken?: string;
				user?: LoginResult['user'];
			};


			if (!response.ok) {
				const backendMessage = data.message ?? data.error ?? 'Unable to sign in.';
				errorMessage = backendMessage;
				throw new Error(backendMessage);
			}

			const loginResult: LoginResult = {
				token: data.token ?? '',
				refreshToken: data.refreshToken ?? '',
				user: data.user ?? {
					id: '',
					userId,
					avatar: null,
					firstname: '',
					lastname: '',
					role: ''
				}
			};

			const cookies = new Cookies();
			cookies.set(authCookies.accessToken, loginResult.token, cookieOptions);
			cookies.set(authCookies.refreshToken, loginResult.refreshToken, cookieOptions);
			cookies.set(authCookies.user, JSON.stringify(loginResult.user), cookieOptions);

			toast.success('Successfully signed in.');
			await goto(resolve('/dashboard'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Login failed', { description });
		} finally {
			isLoading = false;
			errorMessage = '';
		}
	}

	// const handleSubmit: SubmitFunction = () => {
	// 	isLoading = true;
	// 	errorMessage = '';

	// 	return async ({ result }) => {
	// 		isLoading = false;

	// 		const backendMessage =
	// 			(result?.data as { error?: string; message?: string } | undefined)?.error ??
	// 			(result?.data as { error?: string; message?: string } | undefined)?.message ??
	// 			'Unable to sign in.';

	// 		if (result.type === 'success') {
	// 			toast.success('Successfully signed in.');
	// 			const loginResult = result.data as LoginResult;
	// 			const cookies = new Cookies();
	// 			cookies.set(authCookies.accessToken, loginResult.token, cookieOptions);
	// 			cookies.set(authCookies.refreshToken, loginResult.refreshToken, cookieOptions);
	// 			cookies.set(authCookies.user, JSON.stringify(loginResult.user), cookieOptions);
	// 			await goto(resolve('/dashboard'));
	// 			return;
	// 		}

	// 		errorMessage = backendMessage;

	// 		if (result.type === 'failure') {
	// 			toast.error('Sign in failed', { description: backendMessage });
	// 		} else if (result.type === 'error') {
	// 			toast.error('Sign in failed', { description: backendMessage });
	// 		}
	// 	};
	// };
</script>

<Card class="w-full max-w-md border-0 shadow-lg">
	<CardHeader class="space-y-1 text-center">
		<CardTitle class="text-2xl font-semibold">Welcome back</CardTitle>

		<p class="text-sm text-muted-foreground">Sign in to your account to continue</p>
	</CardHeader>

	<CardContent>
		<!-- <form method="POST" use:enhance={handleSubmit} class="space-y-5"> -->
		<form onsubmit={handleSubmission} novalidate class="space-y-5">
			<div class="space-y-2">
				<Label for="userId">User ID</Label>

				<Input
					id="userId"
					name="userId"
					type="text"
					placeholder="Your User ID"
					bind:value={userId}
					required
				/>
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<Label for="password">Password</Label>

					<a
						href={resolve('/forgot-password')}
						class="text-sm font-medium text-primary hover:underline"
					>
						Forgot password?
					</a>
				</div>

				<Input
					id="password"
					name="password"
					type="password"
					placeholder="Your password"
					bind:value={password}
					autocomplete="current-password"
					required
				/>
			</div>

			<!-- {#if errorMessage}
				<p class="text-sm text-destructive" role="alert">{errorMessage}</p>
			{/if} -->

			<Button type="submit" class="w-full" disabled={isLoading}>
				{isLoading ? 'Signing in...' : 'Sign in'}
			</Button>
		</form>
	</CardContent>
</Card>
