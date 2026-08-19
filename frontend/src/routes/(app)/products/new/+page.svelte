<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductForm from '$lib/components/modules/products/products.form.svelte';
</script>

<div class="space-y-6">
	<PageHeader
		title="Add Product"
		description="Create a new product and add it to your inventory."
		actionLabel="Back to Products"
		actionHref="/products"
	/>

	<ProductForm />
</div>
