<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductForm from '$lib/components/modules/products/products.form.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { CreateProductInput } from '$lib/services/product/product.types';
	import { resolve } from '$app/paths';
	import { productService } from '$lib/services/product/product.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';

	let isSubmitting = $state(false);

	// --- Form Submission ---
	async function handleCreate(payload: CreateProductInput) {
		isSubmitting = true;

		try {
			await productService.create(getBrowserServiceContext(), payload);

			toast.success('Product created!');
			goto(resolve('/products'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Product creation failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Add Product"
		description="Create a new product and add it to your inventory."
		actionLabel="Back to Products"
		actionHref="/products"
	/>

	<ProductForm onSubmit={handleCreate} {isSubmitting} />
</div>
