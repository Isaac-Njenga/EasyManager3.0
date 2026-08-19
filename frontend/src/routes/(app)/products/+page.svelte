<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductTable from '$lib/components/modules/products/products.table.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	import { productsData as products } from '$lib/data/products.data';
	import Search from '$lib/components/common/Search.svelte';

	// 1. Reactive search state
	let searchTerm = $state('');
	let selectedStatus = $state('All');

	let isSearching = $state(false);

	const statusTags = ['All', 'Active', 'Inactive'];

	// 2. Automatically derive filtered list based on search term
	let filteredProducts = $derived(
		products.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));
			return matchesSearch && matchesStatus;
		})
	);
</script>

<div class="space-y-6">
	<PageHeader
		title="Products"
		description="Manage your products and inventory."
		actionLabel="+ Add Product"
		actionHref="/products/new"
	/>

	<div>
		<div class="mb-3">
			<!-- 3. Pass state and updater callback -->
			<Search
				value={searchTerm}
				bind:isLoading={isSearching}
				onChange={(val) => (searchTerm = val)}
			/>
		</div>
		<div class="flex gap-2">
			{#each statusTags as tag (tag)}
				<Button
					variant={selectedStatus === tag ? 'default' : 'outline'}
					onclick={() => (selectedStatus = tag)}
				>
					{tag}
				</Button>
			{/each}
		</div>
	</div>

	<div>
		{#if isSearching}
			<div class="align-center flex flex-row items-center justify-center gap-4">
				<Loader2Icon class="animate-spin" />
				<div class="py-8 text-center text-muted-foreground">Loading products...</div>
			</div>
		{:else}
			{#if searchTerm}
				<div class="mb-2 text-sm text-muted-foreground">
					Showing results for <b>"{searchTerm}"</b>
				</div>
			{/if}
			<ProductTable {filteredProducts} />
		{/if}
	</div>
</div>
