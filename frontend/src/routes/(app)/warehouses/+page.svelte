<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { formatCurrency } from '$lib/utils';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	import WarehouseIcon from '@lucide/svelte/icons/warehouse';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import Package from '@lucide/svelte/icons/package';

	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import DataTable from '$lib/components/modules/warehouses/warehouse-table/warehouse.table.svelte';
	import { createWarehouseColumns } from '$lib/components/modules/warehouses/warehouse-table/warehouse.columns';

	let { data }: PageProps = $props();

	// Reactive derivations from server load
	const warehouses = $derived(data.warehouses ?? []);
	const products = $derived(data.products ?? []);
	const error = $derived(data.error);

	// Toast error alert if server load failed
	$effect(() => {
		if (error) {
			toast.error('Failed to load shops', { description: error });
		}
	});

	let isSearching = $state(false);
	const columns = $derived(createWarehouseColumns(products));

	// --- Derived Analytics ---
	const analytics = $derived.by(() => {
		const totalWarehouses = warehouses.length;
		const activeWarehouses = warehouses.filter((w) => w.status === 'Active').length;

		let totalStockValue = 0;
		let totalUnitsStored = 0;
		let totalLowStockAlerts = 0;

		for (const warehouse of warehouses) {
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
</script>

<svelte:head>
	<title>Warehouses | EasyManager</title>
</svelte:head>
<div class="space-y-6">
	<!-- Page Header -->
	<PageHeader
		title="Warehouses"
		description="Manage your warehouses and stock."
		actionLabel="+ Add A Warehouse"
		actionHref="/warehouses/new"
	/>

	<!-- Analytics Cards Grid -->
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Total Warehouses -->
		<div class="rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-muted-foreground uppercase"> Total Facilities </span>
				<div class="rounded-lg bg-primary/10 text-primary">
					<WarehouseIcon class="size-4" />
				</div>
			</div>
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
					{analytics.activeWarehouses}
				</span>/<span class="text-sm font-bold tracking-tight text-foreground">
					{analytics.totalWarehouses} Active
				</span>
			</div>
		</div>

		<!-- Combined Portfolio Stock Value -->
		<div class="rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-muted-foreground uppercase"> Total Stock Value </span>
				<div class="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
					<DollarSign class="size-4" />
				</div>
			</div>
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-2xl font-bold tracking-tight text-green-500">
					{formatCurrency(analytics.totalStockValue)}
				</span>
			</div>
		</div>

		<!-- Total Units Held -->
		<div class="rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-muted-foreground uppercase">
					Total Units Stored
				</span>
				<div class="rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
					<Package class="size-4" />
				</div>
			</div>
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-2xl font-bold tracking-tight text-blue-600">
					{analytics.totalUnitsStored.toLocaleString()}
				</span>
			</div>
		</div>
	</div>

	<div class="space-y-4 rounded-xl border bg-card shadow-sm">
		<div>
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2 class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading warehouses...</div>
				</div>
			{:else}
				<DataTable data={warehouses} {columns} />
			{/if}
		</div>
	</div>
</div>
