<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
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
	let errorMessage = $state('');

	const cookieOptions = {
		path: '/',
		sameSite: 'lax' as const,
		maxAge: 60 * 60 * 24 * 30,
		secure: false
	};

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		errorMessage = '';

		return async ({ result }) => {
			isLoading = false;

			if (result.type === 'success') {
				toast.success('Successfully signed in.');
				const loginResult = result.data as LoginResult;
				const cookies = new Cookies();
				cookies.set(authCookies.accessToken, loginResult.token, cookieOptions);
				cookies.set(authCookies.refreshToken, loginResult.refreshToken, cookieOptions);
				cookies.set(authCookies.user, JSON.stringify(loginResult.user), cookieOptions);
				await goto(resolve('/dashboard'));
				return;
			}

			if (result.type === 'failure') {
				errorMessage = (result.data as { error?: string })?.error ?? 'Unable to sign in.';
				toast.error(errorMessage);
			} else if (result.type === 'error') {
				toast.error('Unable to sign in. Please try again.');
				errorMessage = 'Unable to sign in. Please try again.';
			}
		};
	};
</script>

<Card class="w-full max-w-md border-0 shadow-lg">
	<CardHeader class="space-y-1 text-center">
		<CardTitle class="text-2xl font-semibold">Welcome back</CardTitle>

		<p class="text-sm text-muted-foreground">Sign in to your account to continue</p>
	</CardHeader>

	<CardContent>
		<form method="POST" use:enhance={handleSubmit} class="space-y-5">
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
