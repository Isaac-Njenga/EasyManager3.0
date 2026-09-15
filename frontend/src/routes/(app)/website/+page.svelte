<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import List from '@lucide/svelte/icons/list';
	import Package from '@lucide/svelte/icons/package';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Tag from '@lucide/svelte/icons/tag';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import WebsiteTable from '$lib/components/modules/website/website.table.svelte';
	import { formatCurrency } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const webProducts = $derived(data.webProducts ?? []);
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load shops', { description: error });
		}
	});

	let searchTerm = $state('');
	let isSearching = $state(false);
	let selectedCategory = $state('All');
	let stockFilter = $state<'all' | 'inStock' | 'outOfStock'>('all');
	let viewMode = $state<'table' | 'grid'>('table');

	const categoryTags = [
		'All',
		'Office Items',
		'Living Room Items',
		'Kitchen Items',
		'Outdoor Items',
		'Bedroom Items',
		'Second-Hand Items'
	];

	// Calculated Metrics
	const totalProducts = $derived(webProducts.length);
	const outOfStockCount = $derived(webProducts.filter((p) => p.inStock === false).length);
	const avgDiscount = $derived(
		Math.round(webProducts.reduce((acc, p) => acc + (p.discount || 0), 0) / (totalProducts || 1))
	);
	const totalCatalogValue = $derived(webProducts.reduce((acc, p) => acc + (p.price || 0), 0));

	// Filtering Logic
	let filteredContent = $derived(
		webProducts.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

			const matchesStock =
				stockFilter === 'all' ||
				(stockFilter === 'inStock' && item.inStock !== false) ||
				(stockFilter === 'outOfStock' && item.inStock === false);

			const matchesSearch =
				!normalizedSearch ||
				item.name.toLowerCase().includes(normalizedSearch) ||
				item.category?.toLowerCase().includes(normalizedSearch);

			return matchesCategory && matchesStock && matchesSearch;
		})
	);

	function resetFilters() {
		searchTerm = '';
		selectedCategory = 'All';
		stockFilter = 'all';
	}
</script>

<svelte:head>
	<title>Website | EasyManager</title>
</svelte:head>
<div class="space-y-6">
	<PageHeader
		title="Website Catalog Management"
		description="Monitor inventory status, storefront pricing, and product listings for EasyDeal Furniture."
		actionLabel="+ Add Product"
		actionHref="/website/new"
	/>

	<!-- KPI Metric Cards -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card>
			<CardHeader class="flex flex-row items-center justify-between pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
				<Package class="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{totalProducts}</div>
				<p class="text-xs text-muted-foreground">Active website items</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader class="flex flex-row items-center justify-between pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Inventory Alerts</CardTitle>
				<AlertTriangle class="size-4 text-amber-500" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-amber-600">{outOfStockCount}</div>
				<p class="text-xs text-muted-foreground">Currently out of stock</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader class="flex flex-row items-center justify-between pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Avg. Discount</CardTitle>
				<Tag class="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{avgDiscount}%</div>
				<p class="text-xs text-muted-foreground">Across promotional items</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader class="flex flex-row items-center justify-between pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Catalog Value</CardTitle>
				<DollarSign class="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{formatCurrency(totalCatalogValue)}</div>
				<p class="text-xs text-muted-foreground">Sum of listed retail prices</p>
			</CardContent>
		</Card>
	</div>

	<!-- Toolbar & Filter Area -->
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div class="w-full md:max-w-md">
				<Search
					value={searchTerm}
					bind:isLoading={isSearching}
					onChange={(val) => (searchTerm = val)}
				/>
			</div>

			<!-- View Switcher & Actions -->
			<div class="flex items-center gap-2">
				<div class="flex items-center rounded-lg border bg-muted p-1">
					<Button
						variant={viewMode === 'table' ? 'secondary' : 'ghost'}
						size="sm"
						class="h-7 px-2"
						onclick={() => (viewMode = 'table')}
					>
						<List class="size-4" />
					</Button>
					<Button
						variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
						size="sm"
						class="h-7 px-2"
						onclick={() => (viewMode = 'grid')}
					>
						<LayoutGrid class="size-4" />
					</Button>
				</div>

				{#if searchTerm || selectedCategory !== 'All' || stockFilter !== 'all'}
					<Button variant="outline" size="sm" class="h-9" onclick={resetFilters}>
						<RotateCcw class="mr-1.5 size-3.5" />
						Reset
					</Button>
				{/if}
			</div>
		</div>

		<!-- Filter Pills & Stock Toggle -->
		<div class="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex flex-wrap gap-1.5">
				{#each categoryTags as tag (tag)}
					<Badge
						variant={selectedCategory === tag ? 'default' : 'outline'}
						onclick={() => (selectedCategory = tag)}
						class="cursor-pointer transition-colors"
					>
						{tag}
					</Badge>
				{/each}
			</div>

			<div class="flex items-center gap-2 text-xs">
				<span class="text-muted-foreground">Stock:</span>
				<button
					class="rounded px-2 py-1 font-medium transition-colors {stockFilter === 'all'
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground hover:bg-muted'}"
					onclick={() => (stockFilter = 'all')}
				>
					All
				</button>
				<button
					class="rounded px-2 py-1 font-medium transition-colors {stockFilter === 'inStock'
						? 'bg-emerald-500/10 text-emerald-600'
						: 'text-muted-foreground hover:bg-muted'}"
					onclick={() => (stockFilter = 'inStock')}
				>
					In Stock
				</button>
				<button
					class="rounded px-2 py-1 font-medium transition-colors {stockFilter === 'outOfStock'
						? 'bg-destructive/10 text-destructive'
						: 'text-muted-foreground hover:bg-muted'}"
					onclick={() => (stockFilter = 'outOfStock')}
				>
					Out of Stock
				</button>
			</div>
		</div>

		<!-- Catalog Display Engine -->
		<div class="pt-2">
			{#if isSearching}
				<div class="flex items-center justify-center gap-3 py-12">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-sm text-muted-foreground">Updating product results...</div>
				</div>
			{:else}
				<Separator class="mb-4" />

				<div class="mb-3 flex items-center justify-between text-xs text-muted-foreground">
					<span>
						Showing <b>{filteredContent.length}</b> of <b>{totalProducts}</b> products
					</span>
				</div>

				{#if viewMode === 'table'}
					<WebsiteTable {filteredContent} />
				{:else}
					<!-- Optional Catalog Grid View -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{#each filteredContent as item (item._id)}
							<div
								class="group overflow-hidden rounded-lg border bg-card p-3 transition-all hover:shadow-md"
							>
								<div class="relative mb-3 aspect-square overflow-hidden rounded-md bg-muted">
									{#if item.image?.[0]}
										<img
											src={item.image[0]}
											alt={item.name}
											class="h-full w-full object-cover transition-transform group-hover:scale-105"
										/>
									{:else}
										<div
											class="flex h-full items-center justify-center text-xs text-muted-foreground"
										>
											No Image
										</div>
									{/if}
									{#if item.discount}
										<Badge class="absolute top-2 left-2 bg-destructive text-white">
											-{item.discount}%
										</Badge>
									{/if}
								</div>
								<h3 class="line-clamp-1 font-medium text-foreground">{item.name}</h3>
								<p class="text-xs text-muted-foreground">{item.category}</p>
								<div class="mt-2 flex items-center justify-between">
									<span class="font-bold text-foreground">{formatCurrency(item.price)}</span>
									<Badge
										variant={item.inStock !== false ? 'outline' : 'destructive'}
										class="text-[10px]"
									>
										{item.inStock !== false ? 'In Stock' : 'Out of Stock'}
									</Badge>
								</div>
							</div>
						{:else}
							<div class="col-span-full py-12 text-center text-muted-foreground">
								No products found matching criteria.
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
