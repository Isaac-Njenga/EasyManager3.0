<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import WebProductForm from '$lib/components/modules/website/website.form.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	// import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type { CreateWebProductInput } from '$lib/services/website/website.types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	const selectedWebProduct = $derived(data.webProduct);
	// const error = $derived(data.error);

	let isSubmitting = $state(false);

	// $effect(() => {
	// 	if (error) {
	// 		toast.error('Failed to load item', { description: error });
	// 	}
	// });

	async function handleUpdate(payload: CreateWebProductInput) {
		if (!selectedWebProduct?._id) return;
		isSubmitting = true;

		try {
			// await warehouseService.update(getBrowserServiceContext(), selectedWebProduct._id, payload);
			console.log(payload);

			toast.success('Product updated');
			goto(resolve('/website'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Product update failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Product"
		description="Edit the form to update this item."
		actionLabel="Back to the Website"
		actionHref="/website"
	/>

	<!-- {#if error}
		<div class="flex items-center justify-center py-10">
			<p class="text-destructive">Failed to load details: {error}</p>
		</div>
	{:else} -->

	<WebProductForm webProduct={selectedWebProduct} onSubmit={handleUpdate} {isSubmitting} />
	<!-- {/if} -->
</div>
