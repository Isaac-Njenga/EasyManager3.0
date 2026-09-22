<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductTable from '$lib/components/modules/products/products.table.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import PackageIcon from '@lucide/svelte/icons/package';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import BoxesIcon from '@lucide/svelte/icons/boxes';
	import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';

	import Search from '$lib/components/common/Search.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { formatCurrency } from '$lib/utils';

	let { data }: PageProps = $props();

	const products = $derived(data.products ?? []);
	const error = $derived(data.error);

	// Derived metrics for analytic cards
	const totalProducts = $derived(products.length);
	const activeProducts = $derived(products.filter((p) => p.status === 'Active').length);
	const totalStockQuantity = $derived(
		products.reduce((acc, p) => acc + (p.totalQuantity || 0), 0)
	);
	const totalInventoryValue = $derived(
		products.reduce(
			(acc, p) => acc + (p.costPrice || p.sellingPrice || 0) * (p.totalQuantity || 0),
			0
		)
	);

	$effect(() => {
		if (error) {
			toast.error('Failed to load products', { description: error });
		}
	});

	let searchTerm = $state('');
	let selectedStatus = $state('All');

	let isSearching = $state(false);

	const statusTags = ['All', 'Active', 'Inactive'];

	let filteredProducts = $derived(
		products.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) =>
					String(value).toLowerCase().includes(normalizedSearch)
				);
			return matchesSearch && matchesStatus;
		})
	);
</script>

<svelte:head>
	<title>Products | EasyManager</title>
</svelte:head>

<div class="space-y-6">
	<PageHeader
		title="Products"
		description="Manage your products and inventory."
		actionLabel="+ Add A Product"
		actionHref="/products/new"
	/>

	<!-- Analytics Section -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
				<PackageIcon class="size-5" />
			</div>
			<div>
				<p class="text-xs font-medium text-muted-foreground">Total Products</p>
				<p class="text-2xl font-bold tracking-tight text-foreground">{totalProducts}</p>
			</div>
		</div>

		<div class="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
				<CheckCircle2Icon class="size-5" />
			</div>
			<div>
				<p class="text-xs font-medium text-muted-foreground">Active Catalog</p>
				<p class="text-2xl font-bold tracking-tight text-foreground">{activeProducts}</p>
			</div>
		</div>

		<div class="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
				<BoxesIcon class="size-5" />
			</div>
			<div>
				<p class="text-xs font-medium text-muted-foreground">Total Stock Units</p>
				<p class="text-2xl font-bold tracking-tight text-foreground">{totalStockQuantity}</p>
			</div>
		</div>

		<div class="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
				<DollarSignIcon class="size-5" />
			</div>
			<div>
				<p class="text-xs font-medium text-muted-foreground">Inventory Value</p>
				<p class="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(totalInventoryValue)}</p>
			</div>
		</div>
	</div>

	<!-- Search & Table Container -->
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="mb-3">
			<div class="mb-3">
				<Search
					value={searchTerm}
					bind:isLoading={isSearching}
					onChange={(val) => (searchTerm = val)}
				/>
			</div>
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
					Products: {filteredProducts.length}
				</span>
			</div>
		</div>

		<div>
			{#if isSearching}
				<div class="align-center flex flex-row items-center justify-center gap-4">
					<Loader2Icon class="animate-spin" />
					<div class="py-8 text-center text-muted-foreground">Loading products...</div>
				</div>
			{:else}
				<Separator class="mb-4" />
				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b>
					</div>
				{/if}
				<ProductTable {filteredProducts} />
			{/if}
		</div>
	</div>
</div>