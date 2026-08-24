<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import WarehouseTable from '$lib/components/modules/warehouses/warehouse.table.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import { formatCurrency } from '$lib/utils';

	// Icons for analytic cards
	import WarehouseIcon from '@lucide/svelte/icons/warehouse';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import Package from '@lucide/svelte/icons/package';

	import { warehouseData } from '$lib/data/warehouses.data';

	let searchTerm = $state('');
	let selectedStatus = $state('All');
	let isSearching = $state(false);

	const statusTags = ['All', 'Active', 'Inactive', 'Under Maintenance'];

	// --- Derived Analytics ---
	const analytics = $derived.by(() => {
		const totalWarehouses = warehouseData.length;
		const activeWarehouses = warehouseData.filter((w) => w.status === 'Active').length;

		let totalStockValue = 0;
		let totalUnitsStored = 0;
		let totalLowStockAlerts = 0;

		for (const warehouse of warehouseData) {
			if (warehouse.inventorySummary) {
				totalStockValue += warehouse.inventorySummary.totalStockValue ?? 0;
				totalUnitsStored += warehouse.inventorySummary.totalItemsInStock ?? 0;
				totalLowStockAlerts += warehouse.inventorySummary.lowStockItemsCount ?? 0;
			}
		}

		return {
			totalWarehouses,
			activeWarehouses,
			totalStockValue,
			totalUnitsStored,
			totalLowStockAlerts
		};
	});

	// --- Automatically derive filtered list based on search & status filter ---
	let filteredWarehouses = $derived(
		warehouseData.filter((item) => {
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

	<!-- Analytics Cards Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Total Warehouses -->
		<div class="rounded-xl border bg-card p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					Total Facilities
				</span>
				<div class="rounded-lg bg-primary/10 p-2 text-primary">
					<WarehouseIcon class="size-4" />
				</div>
			</div>
			<div class="mt-3 flex items-baseline gap-2">
				<span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
					{analytics.activeWarehouses}
				</span>/<span class="text-sm font-bold tracking-tight text-foreground">
					{analytics.totalWarehouses} Active
				</span>
			</div>
		</div>

		<!-- Combined Portfolio Stock Value -->
		<div class="rounded-xl border bg-card p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					Total Stock Value
				</span>
				<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
					<DollarSign class="size-4" />
				</div>
			</div>
			<div class="mt-3">
				<span class="text-2xl font-bold tracking-tight text-foreground">
					{formatCurrency(analytics.totalStockValue)}
				</span>
			</div>
		</div>

		<!-- Total Units Held -->
		<div class="rounded-xl border bg-card p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					Total Units Stored
				</span>
				<div class="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
					<Package class="size-4" />
				</div>
			</div>
			<div class="mt-3">
				<span class="text-2xl font-bold tracking-tight text-foreground">
					{analytics.totalUnitsStored.toLocaleString()}
				</span>
			</div>
		</div>
	</div>

	<!-- Search & Filters -->
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

	<!-- Table Container -->
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
