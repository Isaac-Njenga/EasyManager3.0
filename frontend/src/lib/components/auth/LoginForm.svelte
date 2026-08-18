<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let userId = $state('');
	let password = $state('');
	let isLoading = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		isLoading = true;

		// Authentication will be connected later.
		console.log({
			userId,
			password
		});

		await new Promise((resolve) => setTimeout(resolve, 1000));

		isLoading = false;
	}
</script>

<Card class="w-full max-w-md border-0 shadow-lg">
	<CardHeader class="space-y-1 text-center">
		<CardTitle class="text-2xl font-semibold">Welcome back</CardTitle>

		<p class="text-sm text-muted-foreground">Sign in to your account to continue</p>
	</CardHeader>

	<CardContent>
		<form onsubmit={handleSubmit} class="space-y-5">
			<div class="space-y-2">
				<Label for="email">User ID</Label>

				<Input id="text" type="text" placeholder="Your User ID" bind:value={userId} required />
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
					type="password"
					placeholder="Your password"
					bind:value={password}
					autocomplete="current-password"
					required
				/>
			</div>

			<Button type="submit" class="w-full" disabled={isLoading}>
				{isLoading ? 'Signing in...' : 'Sign in'}
			</Button>
		</form>
	</CardContent>
</Card>
