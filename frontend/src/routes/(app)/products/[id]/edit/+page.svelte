<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductForm from '$lib/components/modules/products/products.form.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { productService } from '$lib/services/product/product.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type { CreateProductInput } from '$lib/services/product/product.types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	const selectedProduct = $derived(data.product);
	const error = $derived(data.error);

	let isSubmitting = $state(false);

	$effect(() => {
		if (error) {
			toast.error('Failed to load product', { description: error });
		}
	});

	async function handleUpdate(payload: CreateProductInput) {
		if (!selectedProduct?._id) return;
		isSubmitting = true;

		try {
			await productService.update(getBrowserServiceContext(), selectedProduct._id, payload);

			toast.success('Product updated!');
			goto(resolve('/products'));
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
		description="Edit this product to update your inventory."
		actionLabel="Back to Products"
		actionHref="/products"
	/>

	{#if error}
		<div class="flex items-center justify-center py-10">
			<p class="text-destructive">Failed to load shop details: {error}</p>
		</div>
	{:else}
		<ProductForm product={selectedProduct} onSubmit={handleUpdate} {isSubmitting} />
	{/if}
</div>
