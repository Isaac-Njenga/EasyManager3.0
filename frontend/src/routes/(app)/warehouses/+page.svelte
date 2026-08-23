<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import WarehouseTable from '$lib/components/modules/warehouses/warehouse.table.svelte';

	import { warehouseData as shops } from '$lib/data/warehouses.data';
	import Search from '$lib/components/common/Search.svelte';
	let searchTerm = $state('');
	let selectedStatus = $state('All');
	let isSearching = $state(false);

	const statusTags = ['All', 'Active', 'Inactive', 'Under Maintenance'];

	// 3. Automatically derive filtered list based on search & status filter
	let filteredWarehouses = $derived(
		shops.filter((item) => {
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
	<!-- Page Header -->
	<PageHeader
		title="Warehouses"
		description="Manage your warehouses and stock."
		actionLabel="+ Add A Warehouse"
		actionHref="/warehouses/new"
	/>

	<div class="space-y-3">
		<Search
			value={searchTerm}
			bind:isLoading={isSearching}
			onChange={(val) => (searchTerm = val)}
		/>

		<div class="flex flex-wrap gap-2">
			{#each statusTags as tag (tag)}
				<Badge
					variant={selectedStatus === tag ? 'default' : 'outline'}
					onclick={() => (selectedStatus = tag)}
					class="pointer-fine:cursor-pointer"
				>
					{tag}
				</Badge>
			{/each}
		</div>
	</div>

	<div>
		{#if isSearching}
			<div class="flex items-center justify-center gap-4 py-8">
				<Loader2Icon class="size-5 animate-spin text-primary" />
				<div class="text-muted-foreground">Loading Warehouses...</div>
			</div>
		{:else}
			{#if searchTerm}
				<div class="mb-2 text-sm text-muted-foreground">
					Showing results for <b>"{searchTerm}"</b> ({filteredWarehouses.length} found)
				</div>
			{/if}

			<WarehouseTable {filteredWarehouses} />
		{/if}
	</div>
</div>
