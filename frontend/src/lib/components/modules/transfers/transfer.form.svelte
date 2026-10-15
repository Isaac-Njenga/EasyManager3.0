<script lang="ts">
	import type { Product } from '$lib/services/product/product.types';
	import {
		transferLocations as locations,
		transferStore
	} from '$lib/stores/transfers/transfer.svelte';
	import { shopService } from '$lib/services/shop/shop.service';
	import { warehouseService } from '$lib/services/warehouse/warehouse.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type { TransferLocationOption } from '$lib/stores/transfers/transfer.svelte';
	import { toast } from 'svelte-sonner';
	import DataTable from '$lib/components/modules/transfers/transfer-table-form/transfer.table.form.svelte';
	import {
		createProdColumns,
		type TransferTableProduct
	} from '$lib/components/modules/transfers/transfer-table-form/transfer.table.form.columns';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Search from '@lucide/svelte/icons/search';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import Package from '@lucide/svelte/icons/package';
	import PackageSearch from '@lucide/svelte/icons/package-search';
	import { formatCurrency, matchesSearchQuery } from '$lib/utils';
	import { SvelteMap } from 'svelte/reactivity';

	type Props = {
		products: Product[];
		preselectedSourceId?: string;
	};

	let { products, preselectedSourceId }: Props = $props();

	let searchQuery = $state('');
	let isProductSearchOpen = $state(false);
	let isLocationsLoading = $state(true);
	let selectedProductIds = $state<Record<string, boolean>>({});
	let transferQuantities = $state<Record<string, number>>({});

	$effect(() => {
		let cancelled = false;
		const context = getBrowserServiceContext();

		isLocationsLoading = true;
		Promise.all([warehouseService.fetchAll(context), shopService.fetchAll(context)])
			.then(([warehouses, shops]) => {
				if (cancelled) return;
				const locationOptions: TransferLocationOption[] = [
					...warehouses.map((warehouse) => ({
						locationId: warehouse._id,
						name: warehouse.name,
						locationType: 'Warehouse' as const,
						inventoryItems: warehouse.inventoryItems
					})),
					...shops.map((shop) => ({
						locationId: shop._id,
						name: shop.name,
						locationType: 'Shop' as const,
						inventoryItems: shop.inventoryItems
					}))
				];
				transferStore.setLocations(locationOptions);
			})
			.catch(() => {
				if (!cancelled) toast.error('Failed to load transfer locations');
			})
			.finally(() => {
				if (!cancelled) isLocationsLoading = false;
			});

		return () => {
			cancelled = true;
		};
	});

	// Sync prop sourceId if provided
	$effect(() => {
		if (preselectedSourceId && !transferStore.sourceId) {
			transferStore.sourceId = preselectedSourceId;
		}
	});

	const selectedSource = $derived(
		locations.find((location) => location.locationId === transferStore.sourceId)
	);

	const sourceProducts = $derived.by(() => {
		const sourceInventory = selectedSource?.inventoryItems ?? [];
		const productsById = new SvelteMap<string, Product & { sourceQuantity: number }>();

		for (const entry of sourceInventory) {
			if (!entry?.product) continue;
			const productId =
				typeof entry.product === 'object' ? entry.product?._id : String(entry.product);
			const product =
				typeof entry.product === 'object'
					? entry.product
					: products.find((item) => item._id === productId);
			if (!product) continue;

			const sourceQuantity = Number(entry.quantity) || 0;
			const existing = productsById.get(productId);
			if (existing) {
				existing.sourceQuantity += sourceQuantity;
			} else {
				productsById.set(productId, { ...product, sourceQuantity });
			}
		}

		return [...productsById.values()];
	});

	let filteredProducts = $derived(
		sourceProducts.filter((p) => {
			const isActive = p.status === 'Active';
			if (!isActive) return false;
			return matchesSearchQuery(p, searchQuery);
		})
	);

	const selectedDestination = $derived(
		locations.find((location) => location.locationId === transferStore.destinationId)
	);

	function getLocationInventoryItem(
		location: TransferLocationOption | undefined,
		productId: string
	) {
		return location?.inventoryItems?.find((entry) => {
			if (!entry?.product) return false;
			const product = entry.product;
			return String(typeof product === 'object' ? product._id : product) === productId;
		});
	}

	const transferRows = $derived.by<TransferTableProduct[]>(() =>
		sourceProducts
			.filter((product) => product.status === 'Active')
			.map((product) => {
				const destinationItem = getLocationInventoryItem(selectedDestination, product._id);
				return {
					...product,
					quantityToTransfer: transferQuantities[product._id] ?? 0,
					destinationQuantity: Number(destinationItem?.quantity ?? 0),
					destinationHasProduct: Boolean(destinationItem),
					destinationSelected: Boolean(selectedDestination),
					selectedForTransfer: selectedProductIds[product._id] === true
				};
			})
	);

	function updateTransferQuantity(productId: string, quantity: number) {
		const sourceQuantity =
			sourceProducts.find((product) => product._id === productId)?.sourceQuantity ?? 0;
		transferQuantities[productId] = Math.max(0, Math.min(sourceQuantity, quantity));
	}

	function updateSelection(productId: string, selected: boolean) {
		const sourceQuantity =
			sourceProducts.find((product) => product._id === productId)?.sourceQuantity ?? 0;
		if (selected && sourceQuantity > 0) {
			selectedProductIds[productId] = true;
			if (!transferQuantities[productId]) transferQuantities[productId] = 1;
		} else {
			delete selectedProductIds[productId];
		}
	}

	const transferColumns = createProdColumns({
		onQuantityChange: updateTransferQuantity,
		onSelectionChange: updateSelection
	});

	let previousResetVersion = transferStore.resetVersion;
	$effect(() => {
		const resetVersion = transferStore.resetVersion;
		if (resetVersion === previousResetVersion) return;
		previousResetVersion = resetVersion;
		selectedProductIds = {};
		transferQuantities = {};
	});

	let previousSourceId = transferStore.sourceId;
	$effect(() => {
		const sourceId = transferStore.sourceId;
		if (sourceId === previousSourceId) return;
		previousSourceId = sourceId;
		selectedProductIds = {};
		transferQuantities = {};
	});

	$effect(() => {
		transferStore.items = transferRows
			.filter((product) => product.selectedForTransfer)
			.map((product) => ({ ...product, totalQuantity: product.quantityToTransfer }));
	});

	const destinationOptions = $derived(
		locations.filter((loc) => loc.locationId !== transferStore.sourceId)
	);
</script>

<div class="space-y-6 p-1">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-lg font-bold tracking-tight text-foreground">Initiate Stock Transfer</h2>
			<p class="text-xs text-muted-foreground">Move inventory between warehouses and shops.</p>
		</div>
	</div>

	<!-- Source to Destination Routing Cards -->
	<div class="grid grid-cols-1 items-center gap-3 sm:grid-cols-5">
		<!-- Source Select -->
		<div class="space-y-1.5 sm:col-span-2">
			<Label class="text-xs font-semibold">Source Location</Label>
			<Select.Root type="single" bind:value={transferStore.sourceId}>
				<Select.Trigger class="h-9 w-full text-xs">
					{locations.find((l) => l.locationId === transferStore.sourceId)?.name ?? 'Select Origin'}
				</Select.Trigger>
				<Select.Content>
					{#each locations as loc (loc.locationId)}
						<Select.Item value={loc.locationId} label={loc.name}>
							<span class="font-medium">{loc.name}</span>
							<span class="ml-1 text-[10px] text-muted-foreground">({loc.locationType})</span>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Routing Direction Indicator -->
		<div class="flex justify-center pt-4 sm:col-span-1">
			<div class="rounded-full bg-muted p-2 text-muted-foreground">
				<ArrowRight class="size-4" />
			</div>
		</div>

		<!-- Destination Select -->
		<div class="space-y-1.5 sm:col-span-2">
			<Label class="text-xs font-semibold">Destination Location</Label>
			<Select.Root type="single" bind:value={transferStore.destinationId}>
				<Select.Trigger class="h-9 w-full text-xs">
					{locations.find((l) => l.locationId === transferStore.destinationId)?.name ??
						'Select Destination'}
				</Select.Trigger>
				<Select.Content>
					{#each destinationOptions as loc (loc.locationId)}
						<Select.Item value={loc.locationId} label={loc.name}>
							<span class="font-medium">{loc.name}</span>
							<span class="ml-1 text-[10px] text-muted-foreground">({loc.locationType})</span>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<Separator />

	<div class="space-y-2">
		<div class="flex flex-wrap items-center justify-between gap-2 px-2">
			<h3 class="text-sm font-semibold">Source inventory</h3>
			<p class="text-xs text-muted-foreground">
				{Object.values(selectedProductIds).filter(Boolean).length} item(s) selected
			</p>
		</div>
		{#if isLocationsLoading}
			<div class="rounded-md border p-8 text-center text-sm text-muted-foreground">
				Loading locations and stock...
			</div>
		{:else if !selectedSource}
			<div class="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
				Select a source location to view its inventory.
			</div>
		{:else if transferRows.length === 0}
			<div class="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
				No active products are assigned to this source location.
			</div>
		{:else}
			<DataTable data={transferRows} columns={transferColumns} />
		{/if}
	</div>
	<!-- Line Items Builder -->
	<div class="hidden space-y-3 rounded-xl border bg-card p-5 shadow-sm">
		<div class="flex items-center justify-between">
			<span class="text-xs font-bold tracking-wider text-muted-foreground uppercase">
				Items to Transfer ({transferStore.items.length})
			</span>
		</div>

		<div class="space-y-2">
			<div class="relative">
				<Search class="absolute top-2.5 left-3 size-4 text-muted-foreground" />
				<Input
					id="product-search"
					type="search"
					placeholder="Search product to add..."
					bind:value={searchQuery}
					onfocus={() => (isProductSearchOpen = true)}
					class="pr-10 pl-9"
				/>
				<button
					type="button"
					onclick={() => (isProductSearchOpen = !isProductSearchOpen)}
					class="absolute top-2.5 right-3 text-muted-foreground hover:text-foreground"
				>
					<ChevronsUpDown class="size-4" />
				</button>
			</div>

			<!-- Product Search Dropdown -->
			{#if isProductSearchOpen}
				<div class="max-h-64 overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
					<div
						class="mb-1 flex items-center justify-between border-b px-2 py-1 text-[11px] font-semibold text-muted-foreground"
					>
						<span>Available Products ({filteredProducts.length})</span>
						<button
							type="button"
							class="text-xs hover:underline"
							onclick={() => (isProductSearchOpen = false)}
						>
							Close
						</button>
					</div>

					{#if isLocationsLoading}
						<p class="p-3 text-center text-xs text-muted-foreground">Loading source inventory...</p>
					{:else if !selectedSource}
						<p class="p-3 text-center text-xs text-muted-foreground">
							Select a source location to search its inventory.
						</p>
					{:else if filteredProducts.length === 0}
						<p class="p-3 text-center text-xs text-muted-foreground">
							{sourceProducts.length === 0
								? 'No products are assigned to this source location.'
								: 'No active products match this search.'}
						</p>
					{:else}
						{#each filteredProducts as product (product._id)}
							{@const sourceQuantity = transferStore.getSourceQuantity(product._id)}
							{@const isUnavailable = sourceQuantity <= 0}
							<button
								type="button"
								disabled={isUnavailable}
								class="flex w-full items-center justify-between rounded-sm p-2 text-left hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
								onclick={() => {
									transferStore.addProductItem(product);
									isProductSearchOpen = false;
								}}
							>
								<div class="flex items-center gap-3">
									{#if product.image?.[0]}
										<img
											src={product.image[0]}
											alt="_img"
											class="size-9 rounded border object-cover"
										/>
									{:else}
										<div class="flex size-9 items-center justify-center rounded border bg-muted">
											<Package class="size-4 text-muted-foreground" />
										</div>
									{/if}
									<div>
										<p class="text-xs font-semibold">{product.name}</p>
										<p class="text-[11px] text-muted-foreground">
											{product.code} | Source available: {sourceQuantity} | Destination on hand:
											{getLocationInventoryItem(selectedDestination, product._id)?.quantity ?? 0}
										</p>
										{#if isUnavailable}
											<p class="text-[10px] text-amber-600">
												Not available at the selected source location
											</p>
										{/if}
									</div>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-xs font-bold">{formatCurrency(product.sellingPrice)}</span>
									<Plus class="size-4 text-muted-foreground" />
								</div>
							</button>
						{/each}
					{/if}
				</div>
			{/if}
		</div>

		<!-- Selected Items / Empty State -->
		{#if transferStore.items.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center"
			>
				<PackageSearch class="size-8 text-muted-foreground/60" />
				<p class="mt-2 text-xs font-medium text-foreground">No items selected</p>
				<p class="text-[11px] text-muted-foreground">
					Use the search bar above or add products from the Products table.
				</p>
			</div>
		{:else}
			<div class="space-y-2 pt-2">
				{#each transferStore.items as item, index (item._id)}
					{@const destinationItem = getLocationInventoryItem(selectedDestination, item._id)}
					{@const destinationQuantity = Number(destinationItem?.quantity ?? 0)}
					{@const transferQuantity = Number(item.totalQuantity) || 0}
					<div
						class="grid gap-3 rounded-lg border bg-background p-3 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-end"
					>
						<div class="flex min-w-0 flex-col gap-1.5">
							<Label class="text-[11px]">Item</Label>
							<Input type="text" readonly bind:value={item.name} class="h-9 text-xs" />
						</div>

						<div class="flex flex-col gap-1.5">
							<Label class="text-[11px]">Quantity</Label>
							<Input
								type="number"
								min="1"
								placeholder="Qty"
								max={transferStore.getSourceQuantity(item._id)}
								bind:value={item.totalQuantity}
								class="h-9 text-xs"
							/>
						</div>

						<div class="min-w-0 text-xs sm:pb-1">
							<p class="text-muted-foreground">{item.code}</p>
							<p class="mt-1 text-foreground">
								Destination: {destinationItem ? destinationQuantity : 'Not stocked'}
								<span class="px-1 text-muted-foreground">→</span>
								<span class="font-semibold">{destinationQuantity + transferQuantity}</span>
								<span class="text-muted-foreground">after transfer</span>
							</p>
							<p class="text-[10px] text-muted-foreground">
								Source remaining: {transferStore.getSourceQuantity(item._id) - transferQuantity}
							</p>
						</div>

						<Button
							variant="ghost"
							size="icon"
							onclick={() => transferStore.removeItem(index)}
							class="size-9 shrink-0 text-muted-foreground hover:text-destructive"
						>
							<Trash2 class="size-4 text-destructive" />
						</Button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
