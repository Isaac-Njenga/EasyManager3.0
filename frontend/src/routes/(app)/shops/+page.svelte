<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	import { formatCurrency } from '$lib/utils';

	// Icons for analytics cards
	import Store from '@lucide/svelte/icons/store';
	import Package from '@lucide/svelte/icons/package';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import DataTable from '$lib/components/modules/shop/shop-table/shop.table.svelte';
	import { createShopColumns } from '$lib/components/modules/shop/shop-table/shop.columns';

	let { data }: PageProps = $props();

	// Reactive derivations from server load
	const shops = $derived(data.shops ?? []);
	const products = $derived(data.products ?? []);
	const error = $derived(data.error);

	// Toast error alert if server load failed
	$effect(() => {
		if (error) {
			toast.error('Failed to load shops', { description: error });
		}
	});

	let isSearching = $state(false);
	const columns = $derived(createShopColumns(products));

	// 2. Computed Analytics (Calculated reactively across all shops)
	let analytics = $derived.by(() => {
		let totalShops = shops.length;
		let activeShops = 0;
		let totalUnits = 0;
		let totalStockValue = 0;
		let totalLowStockSKUs = 0;

		for (const shop of shops) {
			if (shop.status === 'Active') activeShops++;

			if (shop.inventorySummary) {
				totalUnits += shop.inventorySummary.totalItemsInStock ?? 0;
				totalStockValue += shop.inventorySummary.totalStockValue ?? 0;
				totalLowStockSKUs += shop.inventorySummary.lowStockItemsCount ?? 0;
			}
		}

		return {
			totalShops,
			activeShops,
			totalUnits,
			totalStockValue,
			totalLowStockSKUs
		};
	});
</script>

<svelte:head>
	<title>Shops | EasyManager</title>
</svelte:head>
<div class="space-y-6">
	<!-- Page Header -->
	<PageHeader
		title="Shops"
		description="Manage your shops and physical locations."
		actionLabel="+ Add A Shop"
		actionHref="/shops/new"
	/>

	<!-- Analytics / KPI Overview Bar -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		<!-- Total Active Shops -->
		<div class="rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-muted-foreground">Active Locations</span>
				<Store class="size-4 text-primary" />
			</div>
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
					{analytics.activeShops}
				</span>
				<span class="text-xs text-muted-foreground">/ {analytics.totalShops} total</span>
			</div>
		</div>

		<!-- Total Network Stock Value -->
		<div class="rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-muted-foreground">Total Valuation</span>
				<DollarSign class="size-4 text-emerald-500" />
			</div>
			<div class="mt-2">
				<span class="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
					{formatCurrency(analytics.totalStockValue)}
				</span>
			</div>
		</div>

		<!-- Total Units across network -->
		<div class="rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-muted-foreground">Units in Stock</span>
				<Package class="size-4 text-blue-500" />
			</div>
			<div class="mt-2">
				<span class="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
					{analytics.totalUnits.toLocaleString()}
				</span>
			</div>
		</div>

		<!-- Low Stock Alerts -->
		<div class="rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-muted-foreground">Low Stock Alerts</span>
				<AlertTriangle class="size-4 text-amber-500" />
			</div>
			<div class="mt-2">
				<span
					class={`text-2xl font-bold tracking-tight ${analytics.totalLowStockSKUs > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}
				>
					{analytics.totalLowStockSKUs} items
				</span>
			</div>
		</div>
	</div>

	<!-- Search & Filters -->
	<div class="space-y-4 rounded-xl border bg-card shadow-sm">
		<div>
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2 class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading shops...</div>
				</div>
			{:else}
				<DataTable data={shops} {columns} />
			{/if}
		</div>
	</div>
</div>
