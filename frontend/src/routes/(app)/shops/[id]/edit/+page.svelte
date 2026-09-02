<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ShopForm from '$lib/components/modules/shop/shop.form.svelte';
	import type { CreateShopInput } from '$lib/types/shop.types';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { shopService } from '$lib/services/shop/shop.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';

	let { data }: PageProps = $props();

	const selectedShop = $derived(data.shop);
	const error = $derived(data.error);

	let isSubmitting = $state(false);

	$effect(() => {
		if (error) {
			toast.error('Failed to load shop', { description: error });
		}
	});

	async function handleUpdate(payload: CreateShopInput) {
		if (!selectedShop?._id) return;
		isSubmitting = true;

		try {
			await shopService.update(getBrowserServiceContext(), selectedShop._id, payload);

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

	{#if error}
		<div class="flex items-center justify-center py-10">
			<p class="text-destructive">Failed to load shop details: {error}</p>
		</div>
	{:else}
		<ShopForm shop={selectedShop} onSubmit={handleUpdate} {isSubmitting} />
	{/if}
</div>
