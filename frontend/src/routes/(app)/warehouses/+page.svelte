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

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';

	let { data }: PageProps = $props();

	// Reactive derivations from server load
	const warehouses = $derived(data.warehouses ?? []);
	const error = $derived(data.error);

	// Toast error alert if server load failed
	$effect(() => {
		if (error) {
			toast.error('Failed to load shops', { description: error });
		}
	});

	let searchTerm = $state('');
	let selectedStatus = $state('All');
	let isSearching = $state(false);

	const statusTags = ['All', 'Active', 'Inactive', 'Under Maintenance'];

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

	// --- Automatically derive filtered list based on search & status filter ---
	let filteredWarehouses = $derived(
		warehouses.filter((item) => {
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

	<!-- Search & Filters -->
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="space-y-3">
			<Search
				value={searchTerm}
				bind:isLoading={isSearching}
				onChange={(val) => (searchTerm = val)}
			/>

			<div class="flex items-center justify-between">
				<div class="flex gap-2">
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

				<span class="text-xs font-medium text-muted-foreground">
					Warehouses: {filteredWarehouses.length}
				</span>
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
				<Separator class="mb-4" />
				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b> ({filteredWarehouses.length} found)
					</div>
				{/if}

				<WarehouseTable {filteredWarehouses} />
			{/if}
		</div>
	</div>
</div>
