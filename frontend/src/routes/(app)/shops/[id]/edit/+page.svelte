<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ShopForm from '$lib/components/modules/shop/shop.form.svelte';
	import type { CreateShopInput } from '$lib/types/shop.types';
	import type { PageProps } from '../$types';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	const shop = $derived(data.shop);

	let isSubmitting = $state(false);

	async function handleUpdate(payload: CreateShopInput) {
		if (!shop?._id) return;
		isSubmitting = true;

		try {
			const response = await fetch(`${env.PUBLIC_SERVER_URL}/shop/update-shop/${shop._id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to update shop');
			}

			toast.success('Shop Updated Successfully!');
			goto(resolve('/shops'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Shop update failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Shop"
		description="Edit this shop's details"
		actionLabel="Back to Shops"
		actionHref="/shops"
	/>

	<ShopForm {shop} onSubmit={handleUpdate} {isSubmitting} />
</div>
