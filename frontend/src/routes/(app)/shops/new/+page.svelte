<script lang="ts">
	import { env } from '$env/dynamic/public';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ShopForm from '$lib/components/modules/shop/shop.form.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { CreateShopInput } from '$lib/types/shop.types';
	import { resolve } from '$app/paths';
	import Cookies from 'universal-cookie';
	import { authCookies } from '$lib/config/auth';

	let isSubmitting = $state(false);

	// --- Form Submission ---
	async function handleCreate(payload: CreateShopInput) {
		isSubmitting = true;

		try {
			const accessToken = new Cookies().get<string>(authCookies.accessToken);
			const response = await fetch(`${env.PUBLIC_SERVER_URL}/shop/create-shop`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify(payload)
			});
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to create shop');
			}

			toast.success('Shop Created Successfully!');
			goto(resolve('/shops'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Shop creation failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Create a Shop"
		description="Fill out the form to create a new shop."
		actionLabel="Back to Shops"
		actionHref="/shops"
	/>

	<ShopForm onSubmit={handleCreate} {isSubmitting} />
</div>
