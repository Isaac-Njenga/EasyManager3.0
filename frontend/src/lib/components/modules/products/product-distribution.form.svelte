<script lang="ts">
	import type { Product } from '$lib/services/product/product.types';
	import type { Shop } from '$lib/services/shop/shop.types';
	import type { Warehouse } from '$lib/services/warehouse/warehouse.types';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PackageIcon from '@lucide/svelte/icons/package';
	import StoreIcon from '@lucide/svelte/icons/store';
	import WarehouseIcon from '@lucide/svelte/icons/warehouse';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

	type DistributionItem = {
		product: Product;
		currentStock: number;
		quantityToAdd: number;
	};

	type Props = {
		products: Product[];
		selectedLocation?: Warehouse | Shop;
		locationType: string;
		onDistribute?: (payload: {
			locationId: string;
			items: { productId: string; quantity: number }[];
		}) => Promise<void>;
	};

	let { products, locationType, selectedLocation, onDistribute }: Props = $props();

	let searchTerm = $state('');
	let isSubmitting = $state(false);

	// Batch queue for items being prepared for distribution
	let queuedItems = $state<Record<string, DistributionItem>>({});

	// Products already assigned to this location from backend data
	const alreadyAssignedProductIds = $derived.by<Set<string>>(() => {
		if (!selectedLocation?.inventoryItems || !Array.isArray(selectedLocation.inventoryItems)) {
			return new Set();
		}

		return new Set(
			selectedLocation.inventoryItems
				.map((item) => {
					const prod = item?.product;
					if (!prod) return null;

					// If populated as an object with _id, use _id; otherwise convert ObjectId/string
					return typeof prod === 'object' && prod !== null && '_id' in prod
						? String(prod._id)
						: String(prod);
				})
				.filter((id): id is string => Boolean(id))
		);
	});

	// Lazy search trigger (>= 2 characters)
	const hasMinSearchLength = $derived(searchTerm.trim().length >= 2);

	const filteredProducts = $derived(
		hasMinSearchLength
			? products.filter((item) => {
					const query = searchTerm.trim().toLowerCase();
					return (
						item.name.toLowerCase().includes(query) ||
						item.code?.toLowerCase().includes(query) ||
						item.sku?.toLowerCase().includes(query)
					);
				})
			: []
	);

	const queuedList = $derived(Object.values(queuedItems));

	const totalUnitsAdding = $derived(
		queuedList.reduce((sum, item) => sum + (Number(item.quantityToAdd) || 0), 0)
	);

	const hasValidAllocations = $derived(
		queuedList.length > 0 && queuedList.some((item) => item.quantityToAdd > 0)
	);

	function getStockAtLocation(product: Product): number {
		if (!selectedLocation) return 0;
		const record = product.inventoryDistribution?.find(
			(dist) => dist.locationId === selectedLocation._id
		);
		return record?.quantity ?? 0;
	}

	function handleAddProductToQueue(product: Product) {
		if (alreadyAssignedProductIds.has(product._id) || queuedItems[product._id]) {
			return;
		}

		queuedItems[product._id] = {
			product,
			currentStock: getStockAtLocation(product),
			quantityToAdd: 1
		};

		searchTerm = '';
	}

	function updateQuantity(productId: string, delta: number) {
		if (!queuedItems[productId]) return;
		const current = Number(queuedItems[productId].quantityToAdd) || 0;
		queuedItems[productId].quantityToAdd = Math.max(0, current + delta);
	}

	function removeItemFromQueue(productId: string) {
		delete queuedItems[productId];
	}

	function resetForm() {
		queuedItems = {};
		searchTerm = '';
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!selectedLocation || !hasValidAllocations) return;

		const validItems = queuedList
			.filter((item) => item.quantityToAdd > 0)
			.map((item) => ({
				productId: item.product._id,
				quantity: item.quantityToAdd
			}));

		isSubmitting = true;
		try {
			await onDistribute?.({
				locationId: selectedLocation._id,
				items: validItems
			});
			console.log({
				locationId: selectedLocation._id,
				items: validItems
			});
			resetForm();
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="h-full space-y-6 rounded-xl border bg-card p-3 shadow-sm">
	<!-- Header -->
	<div class="flex items-center justify-between border-b p-2">
		<div>
			<h3 class="text-base font-semibold text-foreground">
				Stock Distribution for {selectedLocation ? selectedLocation.name : 'Location'}
			</h3>
			<p class="text-xs text-muted-foreground">
				Search and add multiple items to the queue, set quantities, and submit.
			</p>
		</div>
		{#if queuedList.length > 0}
			<button
				type="button"
				onclick={resetForm}
				class="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
			>
				<XIcon class="size-3.5" /> Clear Queue
			</button>
		{/if}
	</div>

	<!-- Target Location Indicator -->
	{#if selectedLocation}
		<div
			class="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs font-medium text-foreground"
		>
			{#if locationType === 'Shop'}
				<StoreIcon class="size-4 text-blue-500" />
			{:else}
				<WarehouseIcon class="size-4 text-purple-500" />
			{/if}
			<span>Target Location: <strong>{selectedLocation.name}</strong> ({locationType})</span>
		</div>
	{/if}

	<!-- 1. Search & Selection Input -->
	<div class="relative space-y-2">
		<label for="product-search" class="block text-xs font-medium text-foreground">
			Search Products to Add
		</label>
		<div class="relative">
			<SearchIcon class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<input
				id="product-search"
				type="text"
				placeholder="Type name, SKU, or code to search items..."
				bind:value={searchTerm}
				class="w-full rounded-lg border bg-background py-2.5 pr-9 pl-9 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
			/>
			{#if searchTerm}
				<button
					type="button"
					onclick={() => (searchTerm = '')}
					class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				>
					<XIcon class="size-4" />
				</button>
			{/if}
		</div>

		<!-- Search Results Overlay -->
		{#if hasMinSearchLength}
			<div
				class="mt-2 max-h-72 overflow-y-auto rounded-lg border border-border bg-popover shadow-md"
			>
				{#if filteredProducts.length > 0}
					<div class="divide-y divide-border">
						{#each filteredProducts as product (product._id)}
							{@const isAlreadyAssigned = alreadyAssignedProductIds.has(product._id)}
							{@const isAlreadyQueued = Boolean(queuedItems[product._id])}

							<div
								class="flex items-center justify-between p-3 transition-colors hover:bg-accent/50"
							>
								<div class="flex items-center gap-3">
									<div
										class="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"
									>
										<PackageIcon class="size-5" />
									</div>
									<div>
										<div class="text-sm font-medium text-foreground">{product.name}</div>
										<div class="text-xs text-muted-foreground">
											Code: {product.code || 'N/A'} • Total Stock: {product.totalQuantity ?? 0}
										</div>
									</div>
								</div>

								<div>
									{#if isAlreadyAssigned}
										<span
											class="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400"
										>
											<AlertCircleIcon class="size-3.5" /> Item already included in this location
										</span>
									{:else if isAlreadyQueued}
										<span
											class="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
										>
											Added to Queue
										</span>
									{:else}
										<button
											type="button"
											onclick={() => handleAddProductToQueue(product)}
											class="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
										>
											<PlusIcon class="size-3.5" /> Add
										</button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="p-6 text-center text-xs text-muted-foreground">
						No products found matching "{searchTerm}".
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- 2. Multi-Item Distribution Form Table -->
	{#if queuedList.length > 0}
		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="overflow-hidden rounded-lg border border-border">
				<table class="w-full text-left text-sm">
					<thead class="bg-muted/50 text-xs font-medium text-muted-foreground uppercase">
						<tr>
							<th class="px-4 py-3">Product Item</th>
							<th class="px-4 py-3 text-center">Current Location Stock</th>
							<th class="px-4 py-3 text-center">Add Quantity</th>
							<th class="px-4 py-3 text-right">Expected Total</th>
							<th class="px-4 py-3 text-center">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border">
						{#each queuedList as item (item.product._id)}
							{@const expectedTotal = item.currentStock + (Number(item.quantityToAdd) || 0)}

							<tr class="transition-colors hover:bg-muted/30">
								<td class="px-4 py-3">
									<div class="font-medium text-foreground">{item.product.name}</div>
									<div class="text-xs text-muted-foreground">
										Code: {item.product.code || 'N/A'}
									</div>
								</td>
								<td class="px-4 py-3 text-center font-mono text-muted-foreground">
									{item.currentStock}
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center justify-center gap-1.5">
										<button
											type="button"
											onclick={() => updateQuantity(item.product._id, -1)}
											disabled={item.quantityToAdd <= 0}
											class="flex size-7 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-accent disabled:opacity-30"
										>
											<MinusIcon class="size-3.5" />
										</button>
										<input
											type="number"
											min="0"
											step="1"
											bind:value={queuedItems[item.product._id].quantityToAdd}
											class="w-20 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm focus:ring-2 focus:ring-primary focus:outline-none"
										/>
										<button
											type="button"
											onclick={() => updateQuantity(item.product._id, 1)}
											class="flex size-7 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-accent"
										>
											<PlusIcon class="size-3.5" />
										</button>
									</div>
								</td>
								<td
									class="px-4 py-3 text-right font-mono font-bold {item.quantityToAdd > 0
										? 'text-primary'
										: 'text-foreground'}"
								>
									{expectedTotal}
								</td>
								<td class="px-4 py-3 text-center">
									<button
										type="button"
										onclick={() => removeItemFromQueue(item.product._id)}
										class="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
										title="Remove item"
									>
										<Trash2Icon class="size-4" />
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Footer Summary and Action Bar -->
			<div class="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3">
				<div class="text-xs text-muted-foreground">
					Queued items: <span class="font-semibold text-foreground">{queuedList.length}</span> |
					Total units being added:
					<span class="ml-1 font-mono text-sm font-bold text-foreground">{totalUnitsAdding}</span>
				</div>
				<div class="flex items-center gap-3">
					<button
						type="button"
						onclick={resetForm}
						class="rounded-lg border px-4 py-2 text-xs font-medium hover:bg-accent"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting || !hasValidAllocations}
						class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
					>
						{#if isSubmitting}
							<Loader2Icon class="size-4 animate-spin" /> Submitting...
						{:else}
							Confirm Allocations ({queuedList.length})
						{/if}
					</button>
				</div>
			</div>
		</form>
	{:else}
		<div class="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
			Search and select unallocated products above to add them to this location's queue.
		</div>
	{/if}
</div>
