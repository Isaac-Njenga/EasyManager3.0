<script lang="ts">
	import { canWrite } from '$lib/config/permissions';
	import { page } from '$app/state';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import List from '@lucide/svelte/icons/list';
	import Package from '@lucide/svelte/icons/package';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Tag from '@lucide/svelte/icons/tag';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import DataTable from '$lib/components/modules/website/website-table/website.table.svelte';
	import { WebProductColumns as WebsiteColumns } from '$lib/components/modules/website/website-table/website.columns';
	import { formatCurrency, matchesSearchQuery } from '$lib/utils';
	import Modal from '$lib/components/common/Modal.svelte';
	import ProductDetails from './WebProductDetail.svelte';
	import { toast } from 'svelte-sonner';
	import {
		catalogDiscount,
		categoryName,
		type WebProduct
	} from '$lib/services/website/website.types';
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { CatalogProductService } from '$lib/services/website/website.service';
	import ProductCard from '$lib/components/common/ProductCard.svelte';

	let { data }: PageProps = $props();

	const webProducts = $derived(data.catalogProducts ?? []);
		const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load catalog', { description: error });
		}
	});

	let selectedItem = $state({} as WebProduct);
	let isDetailModalOpen = $state(false);
	let isDeleteWebProductOpen = $state(false);

	function viewItem(item: WebProduct) {
		selectedItem = item;
		isDetailModalOpen = true;
	}

	function editWebProduct(item: WebProduct) {
		goto(resolve(`/website/${item._id}/edit`));
	}

	function openDeleteModal(item: WebProduct) {
		selectedItem = item;
		isDeleteWebProductOpen = true;
	}

	async function deleteItem(item: WebProduct) {
		try {
			await CatalogProductService.delete(getBrowserServiceContext(), item._id);
			toast.success(`Item ${item.name} deleted`);
			isDeleteWebProductOpen = false;
			selectedItem = {} as WebProduct;
			await invalidateAll();
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to delete item.';
			toast.error('Product deletion failed', { description });
		}
	}

	let searchTerm = $state('');
	let isSearching = $state(false);
	let selectedCategory = $state('All');
	let statusFilter = $state<'all' | 'published' | 'unpublished'>('all');
	let viewMode = $state<'table' | 'grid'>('table');

	// Calculated Metrics
	const totalProducts = $derived(webProducts.length);
	const unpublishedCount = $derived(webProducts.filter((p) => p.status !== 'PUBLISHED').length);
	const avgDiscount = $derived(
		Math.round(
			webProducts.reduce((acc, p) => acc + (catalogDiscount(p) || 0), 0) / (totalProducts || 1)
		)
	);
	const totalCatalogValue = $derived(
		webProducts
			.filter((p) => p.pricing.currency === 'KES')
			.reduce((acc, p) => acc + (p.pricing.basePrice || 0), 0)
	);

	// Filtering Logic
	let filteredContent = $derived(
		webProducts.filter((item) => {
			const matchesCategory =
				selectedCategory === 'All' ||
				categoryName(item.category) === `${selectedCategory}`;

			const matchesStock =
				statusFilter === 'all' ||
				(statusFilter === 'published' && item.status === 'PUBLISHED') ||
				(statusFilter === 'unpublished' && item.status !== 'PUBLISHED');

			const matchesSearch = matchesSearchQuery(item, searchTerm);

			return matchesCategory && matchesStock && matchesSearch;
		})
	);
</script>

<svelte:head>
	<title>Website</title>
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
		<Card class="py-auto px-0">
			<CardHeader class="flex flex-row items-center justify-between">
				<CardTitle class="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
				<Package class="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent class="py-0">
				<div class="text-2xl font-bold">{totalProducts}</div>
				<p class="text-xs text-muted-foreground">Catalog items</p>
			</CardContent>
		</Card>

		<Card class="py-auto px-0">
			<CardHeader class="flex flex-row items-center justify-between">
				<CardTitle class="text-sm font-medium text-muted-foreground">Unpublished Items</CardTitle>
				<AlertTriangle class="size-4 text-amber-500" />
			</CardHeader>
			<CardContent class="py-0">
				<div class="text-2xl font-bold text-amber-600">{unpublishedCount}</div>
				<p class="text-xs text-muted-foreground">Draft or archived items</p>
			</CardContent>
		</Card>

		<Card class="py-auto px-0">
			<CardHeader class="flex flex-row items-center justify-between">
				<CardTitle class="text-sm font-medium text-muted-foreground">Avg. Discount</CardTitle>
				<Tag class="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent class="py-0">
				<div class="text-2xl font-bold">{avgDiscount}%</div>
				<p class="text-xs text-muted-foreground">Across promotional items</p>
			</CardContent>
		</Card>

		<Card class="py-auto px-0">
			<CardHeader class="flex flex-row items-center justify-between">
				<CardTitle class="text-sm font-medium text-muted-foreground">Catalog Value</CardTitle>
				<DollarSign class="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent class="py-0">
				<div class="text-2xl font-bold">{formatCurrency(totalCatalogValue)}</div>
				<p class="text-xs text-muted-foreground">Sum of KES base prices</p>
			</CardContent>
		</Card>
	</div>

	<!-- Toolbar & Filter Area -->
	<div class="space-y-4 rounded-xl border bg-card p-2 shadow-sm">
		<div class="flex flex-row justify-between p-2 pb-0">
			<div class="flex items-center gap-2 text-xs">
				<span class="text-muted-foreground">Publishing:</span>
				<button
					class="rounded px-2 py-1 font-medium transition-colors {statusFilter === 'all'
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground hover:bg-muted'}"
					onclick={() => (statusFilter = 'all')}
				>
					All
				</button>
				<button
					class="rounded px-2 py-1 font-medium transition-colors {statusFilter === 'published'
						? 'bg-emerald-500/10 text-emerald-600'
						: 'text-muted-foreground hover:bg-muted'}"
					onclick={() => (statusFilter = 'published')}
				>
					Published
				</button>
				<button
					class="rounded px-2 py-1 font-medium transition-colors {statusFilter === 'unpublished'
						? 'bg-destructive/10 text-destructive'
						: 'text-muted-foreground hover:bg-muted'}"
					onclick={() => (statusFilter = 'unpublished')}
				>
					Unpublished
				</button>
			</div>

			<!-- View Switcher & Actions -->
			<div class="flex items-center gap-2">
				<div class="flex items-center rounded-sm border bg-muted">
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
			</div>
		</div>

		<!-- Catalog Display Engine -->
		<div class="pt-0">
			{#if isSearching}
				<div class="flex items-center justify-center gap-3 py-12">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-sm text-muted-foreground">Updating product results...</div>
				</div>
			{:else}
				{#if viewMode === 'table'}
					<DataTable data={filteredContent} columns={WebsiteColumns} />
				{:else}
					<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{#each filteredContent as item (item._id)}
							<ProductCard {item} handleViewItem={viewItem} />
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<Modal bind:open={isDetailModalOpen}>
	{#if selectedItem}
		<div class="no-scrollbar min-h-0 overflow-y-auto">
			<ProductDetails product={selectedItem} isOpen={isDetailModalOpen} />
		</div>
	{/if}
	{#snippet footer()}
		<div class="flex w-full flex-row items-center justify-end gap-2">
			{#if canWrite(page.data.role)}<Button
					size="xs"
					variant="default"
					onclick={() => {
						if (selectedItem) {
							editWebProduct(selectedItem);
						}
					}}
				>
					Edit
				</Button>{/if}
			{#if canWrite(page.data.role)}<Button
					size="xs"
					variant="destructive"
					onclick={() => {
						if (selectedItem) {
							openDeleteModal(selectedItem);
						}
					}}
				>
					Delete
				</Button>{/if}
		</div>
	{/snippet}
</Modal>

<DeleteDialog
	bind:open={isDeleteWebProductOpen}
	handleDelete={() => selectedItem && deleteItem(selectedItem)}
/>
