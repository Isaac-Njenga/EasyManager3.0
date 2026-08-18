<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductTable from '$lib/components/modules/products/products.table.svelte';

	import { productsData as products } from '$lib/data/products.data';
</script>

<div class="space-y-6">
	<PageHeader
		title="Products"
		description="Manage your products and inventory."
		actionLabel="Add Product"
		// actionHref="/products/new"
	/>

	<ProductTable {products} />
</div>
