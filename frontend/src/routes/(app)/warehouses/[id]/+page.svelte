<script lang="ts">
	import { formatCurrency } from '$lib/utils';
	import type { Product } from '$lib/services/product/product.types';
	import type { Warehouse } from '$lib/services/warehouse/warehouse.types';
	import Modal from '$lib/components/common/Modal.svelte';

	import Separator from '$lib/components/ui/separator/separator.svelte';

	import MapPin from '@lucide/svelte/icons/map-pin';
	import Package from '@lucide/svelte/icons/package';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import FileText from '@lucide/svelte/icons/file-text';
	import LogFooter from '$lib/components/common/LogFooter.svelte';
	import type { PageProps } from './$types';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductsTable from '$lib/components/modules/products/products.table.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import Boxes from '@lucide/svelte/icons/boxes';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { transferStore } from '$lib/stores/transfer.svelte';
	import TransferForm from '$lib/components/modules/transfers/transfer.form.svelte';
	import { toast } from 'svelte-sonner';

	let { data }: PageProps = $props();

	const selectedWarehouse = $derived(data.warehouse);
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load warehouse', { description: error });
		}
	});

	let searchTerm = $state('');
	let isSearching = $state(false);
	let isTransferDrawerOpen = $state(false);

	function transferStock(warehouse: Warehouse) {
		transferStore.start(warehouse._id);
		isTransferDrawerOpen = true;
	}

	function executeTransferAction() {
		transferStore.handleTransfer();
		if (transferStore.items.length === 0) {
			isTransferDrawerOpen = false;
		}
	}

	const populatedProducts = $derived.by<Product[]>(() => {
		if (!selectedWarehouse?.inventoryItems) return [];
		return selectedWarehouse.inventoryItems.filter(
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

{#if selectedWarehouse}
	<div class="space-y-6">
		<PageHeader
			title={selectedWarehouse.name}
			description={`Logistics & Storage Hub | ${selectedWarehouse.status}`}
			actionLabel="Back to Warehouses"
			actionHref="/warehouses"
		/>

		<!-- Stock Metrics Grid -->
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			<!-- Total Valuation -->
			<div class="rounded-lg border bg-card p-4 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<DollarSign class="size-3.5 text-green-500" /> Stock Value
				</div>
				<p class="mt-1 text-sm font-bold text-green-500">
					{formatCurrency(selectedWarehouse.inventorySummary?.totalStockValue ?? 0)}
				</p>
			</div>

			<!-- Total Items -->
			<div class="rounded-lg border bg-card p-4 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<Package class="size-3.5 text-blue-500" /> Total Units
				</div>
				<p class="mt-1 text-sm font-bold text-blue-500">
					{(selectedWarehouse.inventorySummary?.totalItemsInStock ?? 0).toLocaleString()}
				</p>
			</div>

			<!-- Location -->
			<div class="rounded-lg border bg-card p-4 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<MapPin class="size-3.5 text-orange-500" /> Location
				</div>
				<p class="mt-1 text-sm font-bold text-orange-500">
					{selectedWarehouse.address.building || 'N/A'}, {selectedWarehouse.address.city}
				</p>
			</div>

			<!-- Out of Stock / Low Stock -->
			<div class="rounded-lg border bg-card p-4 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<AlertTriangle class="size-3.5 text-amber-500" /> Stock Alerts
				</div>
				<div class="mt-1 flex items-baseline gap-2">
					<span
						class={`text-sm font-bold ${(selectedWarehouse.inventorySummary?.lowStockItemsCount ?? 0) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}
					>
						{selectedWarehouse.inventorySummary?.lowStockItemsCount ?? 0} Low
					</span>
					{#if (selectedWarehouse.inventorySummary?.outOfStockItemsCount ?? 0) > 0}
						<span class="text-xs text-destructive">
							({selectedWarehouse.inventorySummary?.outOfStockItemsCount} Out)
						</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Inventory Products Section -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading items...</div>
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
								console.log('btn');
								transferStock(selectedWarehouse);
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
						// shopId={selectedWarehouse._id}
					/>
				{:else}
					<div class="py-8 text-center text-xs text-muted-foreground">
						No product records loaded for this warehouse.
					</div>
				{/if}
			{/if}
		</div>

		<!-- Operational Remarks & Notes -->
		{#if selectedWarehouse.notes}
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
					{selectedWarehouse.notes}
				</p>
			</div>
		{/if}

		<LogFooter
			createTimestamp={selectedWarehouse.createdAt}
			updateTimestamp={selectedWarehouse.updatedAt}
		/>
	</div>
{:else}
	<div class="py-12 text-center text-xs text-muted-foreground">
		No warehouse selected to display details.
	</div>
{/if}

<Modal
	bind:open={isTransferDrawerOpen}
	title={selectedWarehouse?.name ?? 'Initiate Stock Transfer'}
	description={selectedWarehouse ? selectedWarehouse.warehouseCode : ''}
>
	{#if selectedWarehouse}
		<TransferForm preselectedSourceId={selectedWarehouse._id} />
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
