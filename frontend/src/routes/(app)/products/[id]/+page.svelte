<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductForm from '$lib/components/modules/products/products.form.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const product = $derived(data.product);
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Product"
		description="Edit this product to update your inventory."
		actionLabel="Back to Products"
		actionHref="/products"
	/>

	<ProductForm {product} />
</div>
