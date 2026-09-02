<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ShopForm from '$lib/components/modules/shop/shop.form.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { CreateShopInput } from '$lib/services/shop/shop.types';
	import { resolve } from '$app/paths';
	import { shopService } from '$lib/services/shop/shop.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';

	let isSubmitting = $state(false);

	// --- Form Submission ---
	async function handleCreate(payload: CreateShopInput) {
		isSubmitting = true;

		try {
			await shopService.create(getBrowserServiceContext(), payload);

			toast.success('Shop created!');
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
