<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductTable from '$lib/components/modules/products/products.table.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { productsData as products } from '$lib/data/products.data';
	import Search from '$lib/components/common/Search.svelte';

	// 1. Reactive search state
	let searchTerm = $state('');

	// 2. Automatically derive filtered list based on search term
	let filteredProducts = $derived(
		products.filter((item) =>
			Object.values(item).some((value) =>
				String(value).toLowerCase().includes(searchTerm.toLowerCase().trim())
			)
		)
	);
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
			<!-- 3. Pass state and updater callback -->
			<Search value={searchTerm} onChange={(val) => (searchTerm = val)} />
		</div>
		<div>
			<Button variant="outline">Active</Button>
			<Button>Inactive</Button>
		</div>
	</div>

	<ProductTable {filteredProducts} />
</div>
