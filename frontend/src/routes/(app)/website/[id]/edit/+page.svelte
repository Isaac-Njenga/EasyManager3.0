<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import WebProductForm from '$lib/components/modules/website/website.form.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type {
		CreateWebProductInput,
		CreateDescriptionInput,
		GeneratedDescriptionResponse
	} from '$lib/services/website/website.types';
	import { goto } from '$app/navigation';
	import { webProductService } from '$lib/services/website/website.service';

	let { data }: PageProps = $props();

	const webProduct = $derived(data.webProduct);
	const error = $derived(data.error);

	let isSubmitting = $state(false);
	let isGenerating = $state(false);

	$effect(() => {
		if (error) {
			toast.error('Failed to load item', { description: error });
		}
	});

	async function handleUpdate(payload: CreateWebProductInput) {
		const product = await webProduct;
		if (!product?._id) return;
		isSubmitting = true;

		try {
			await webProductService.update(getBrowserServiceContext(), product._id, payload);
			// console.log(payload);

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

	async function handleDescGeneration(
		payload: CreateDescriptionInput
	): Promise<GeneratedDescriptionResponse | undefined> {
		isGenerating = true;

		try {
			// console.log(payload);
			const res = await webProductService.description(getBrowserServiceContext(), payload);
			toast.success('Description generated');
			return res;
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Description generation failed', { description });
		} finally {
			isGenerating = false;
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

	{#if error}
		<div class="flex items-center justify-center py-10">
			<p class="text-destructive">Failed to load details: {error}</p>
		</div>
	{:else}
		{#await webProduct then product}
			<WebProductForm
				webProduct={product}
				onSubmit={handleUpdate}
				onDescriptionSubmit={handleDescGeneration}
				{isSubmitting}
				{isGenerating}
			/>
		{/await}
	{/if}
</div>
