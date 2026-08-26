<script lang="ts">
	import type { Shop } from '$lib/types/shop.types';
	import type { Product } from '$lib/types/product.types';
	import { formatCurrency } from '$lib/utils';
	import Modal from '$lib/components/common/Modal.svelte';

	import Separator from '$lib/components/ui/separator/separator.svelte';

	import MapPin from '@lucide/svelte/icons/map-pin';
	import Package from '@lucide/svelte/icons/package';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import FileText from '@lucide/svelte/icons/file-text';
	import Boxes from '@lucide/svelte/icons/boxes';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	import LogFooter from '$lib/components/common/LogFooter.svelte';
	import ProductsTable from '$lib/components/modules/products/products.table.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import type { PageProps } from './$types';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { transferStore } from '$lib/stores/transfer.svelte';
	import TransferForm from '$lib/components/modules/transfers/transfer.form.svelte';

	let { data }: PageProps = $props();

	const selectedShop = $derived(data.shop);

	let searchTerm = $state('');
	let isSearching = $state(false);
	let isTransferDrawerOpen = $state(false);

	function transferStock(shop: Shop) {
		transferStore.start(shop._id);
		isTransferDrawerOpen = true;
	}

	function executeTransferAction() {
		transferStore.handleTransfer();
		if (transferStore.items.length === 0) {
			isTransferDrawerOpen = false;
		}
	}

	// Filter populated Product objects from string IDs safely
	const populatedProducts = $derived.by<Product[]>(() => {
		if (!selectedShop?.inventoryItems) return [];
		return selectedShop.inventoryItems.filter(
			(item): item is Product => typeof item === 'object' && item !== null && '_id' in item
		);
	});

	let filteredInventory = $derived(
		populatedProducts.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));

			return matchesSearch;
		})
	);
</script>

{#if selectedShop}
	<div class="space-y-6">
		<PageHeader
			title={selectedShop.name}
			description={`${selectedShop.type} | ${selectedShop.status}`}
			actionLabel="Back to Shops"
			actionHref="/shops"
		/>

		<!-- Quick Stock Metrics Grid -->
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			<!-- Total Stock Value -->
			<div class="rounded-lg border bg-card p-4 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<DollarSign class="size-3.5 text-green-600" /> Stock Value
				</div>
				<p class="mt-1 text-sm font-bold text-green-600 dark:text-green-400">
					{formatCurrency(selectedShop.inventorySummary?.totalStockValue ?? 0)}
				</p>
			</div>

			<!-- Total Units -->
			<div class="rounded-lg border bg-card p-4 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<Package class="size-3.5 text-blue-500" /> Total Units
				</div>
				<p class="mt-1 text-sm font-bold text-blue-500">
					{(selectedShop.inventorySummary?.totalItemsInStock ?? 0).toLocaleString()}
				</p>
			</div>

			<!-- Location -->
			<div class="rounded-lg border bg-card p-4 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<MapPin class="size-3.5  text-orange-500" /> Location
				</div>
				<p class="mt-1 text-sm font-bold text-orange-500">
					{selectedShop.address.building || 'N/A'}, {selectedShop.address.town}
				</p>
			</div>

			<!-- Low Stock Alert -->
			<div class="rounded-lg border bg-card p-4 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<AlertTriangle class="size-3.5 text-amber-500" /> Low Stock
				</div>
				<p
					class={`mt-1 text-sm font-bold ${(selectedShop.inventorySummary?.lowStockItemsCount ?? 0) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}
				>
					{selectedShop.inventorySummary?.lowStockItemsCount ?? 0} items
				</p>
			</div>
		</div>

		<!-- Inventory Products Section -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading shops...</div>
				</div>
			{:else}
				<div class="flex items-center justify-between">
					<div>
						<h3
							class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
						>
							<Boxes class="size-4 text-primary" /> Inventory Items
						</h3>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-xs font-medium text-muted-foreground">
							Products:{populatedProducts.length}
						</span>|
						<Button
							size="xs"
							onclick={() => {
								transferStock(selectedShop);
							}}>Transfer</Button
						>
					</div>
				</div>
				<Separator />

				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b> ({filteredInventory.length} found)
					</div>
				{/if}
				<div class="space-y-3">
					<Search
						value={searchTerm}
						bind:isLoading={isSearching}
						onChange={(val) => (searchTerm = val)}
					/>
				</div>
				{#if populatedProducts.length > 0}
					<ProductsTable
						filteredProducts={filteredInventory}
						// shopId={selectedShop._id}
					/>
				{:else}
					<div class="py-8 text-center text-xs text-muted-foreground">
						No detailed product records loaded for this shop.
					</div>
				{/if}
			{/if}
		</div>

		<!-- Notes Section -->
		{#if selectedShop.notes}
			<div class="space-y-2 rounded-xl border bg-card p-5 shadow-sm">
				<h3
					class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
				>
					<FileText class="size-4 text-primary" /> Notes
				</h3>
				<Separator />
				<p
					class="rounded-md bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre-wrap text-foreground"
				>
					{selectedShop.notes}
				</p>
			</div>
		{/if}

		<LogFooter createTimestamp={selectedShop.createdAt} updateTimestamp={selectedShop.updatedAt} />
	</div>
{:else}
	<div class="py-12 text-center text-xs text-muted-foreground">
		No shop selected to display details.
	</div>
{/if}

<Modal
	bind:open={isTransferDrawerOpen}
	title={selectedShop?.name ?? 'Initiate Stock Transfer'}
	description={selectedShop ? selectedShop.shopCode : ''}
>
	{#if selectedShop}
		<TransferForm preselectedSourceId={selectedShop._id} />
	{/if}
	{#snippet footer()}
		<div class="flex w-full flex-row items-center justify-end gap-2">
			<Button
				size="xs"
				variant="default"
				disabled={transferStore.items.length === 0}
				onclick={executeTransferAction}>Initiate Transfer</Button
			>
			<Dialog.Close class={buttonVariants({ variant: 'outline', size: 'xs' })}>Close</Dialog.Close>
		</div>
	{/snippet}
</Modal>
