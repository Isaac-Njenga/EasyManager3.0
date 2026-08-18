<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductTable from '$lib/components/modules/products/products.table.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { productsData as products } from '$lib/data/products.data';
	import Search from '$lib/components/common/Search.svelte';
</script>

<div class="space-y-6">
	<PageHeader
		title="Products"
		description="Manage your products and inventory."
		actionLabel="Add Product"
		// actionHref="/products/new"
	/>

	<div>
		<div class="mb-3">
			<Search />
		</div>
		<div>
			<Button variant="outline">Active</Button>
			<Button>Inactive</Button>
		</div>
	</div>

	<ProductTable {products} />
</div>
