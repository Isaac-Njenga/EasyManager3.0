<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import ShopTable from '$lib/components/modules/shop/shop.table.svelte';

	// import { shopsData as shops } from '$lib/data/shop.data';
	import Search from '$lib/components/common/Search.svelte';
	import { formatCurrency } from '$lib/utils';

	// Icons for analytics cards
	import Store from '@lucide/svelte/icons/store';
	import Package from '@lucide/svelte/icons/package';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';

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

	// 1. Reactive search state
	let searchTerm = $state('');
	let selectedStatus = $state('All');
	let isSearching = $state(false);

	const statusTags = ['All', 'Active', 'Inactive', 'Under Maintenance'];

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

	// 3. Automatically derive filtered list based on search & status filter
	let filteredShops = $derived(
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
					Shops: {filteredShops.length}
				</span>
			</div>
		</div>

		<div>
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2 class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading shops...</div>
				</div>
			{:else}
				<Separator class="mb-4" />
				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b> ({filteredShops.length} found)
					</div>
				{/if}

				<ShopTable {filteredShops} {products} />
			{/if}
		</div>
	</div>
</div>
