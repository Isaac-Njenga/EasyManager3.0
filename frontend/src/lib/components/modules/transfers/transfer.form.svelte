<script lang="ts">
	import type { Product } from '$lib/services/product/product.types';
	import {
		transferLocations as locations,
		transferStore
	} from '$lib/stores/transfers/transfer.svelte';
	import { shopService } from '$lib/services/shop/shop.service';
	import { warehouseService } from '$lib/services/warehouse/warehouse.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type { LocationOption } from '$lib/stores/transfers/transfer.svelte';
	import { toast } from 'svelte-sonner';

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
	import { formatCurrency } from '$lib/utils';

	type Props = {
		products: Product[];
		preselectedSourceId?: string;
	};

	let { products, preselectedSourceId }: Props = $props();

	let searchQuery = $state('');
	let isProductSearchOpen = $state(false);

	$effect(() => {
		let cancelled = false;
		const context = getBrowserServiceContext();

		Promise.all([warehouseService.fetch(context), shopService.fetch(context)])
			.then(([warehouses, shops]) => {
				if (cancelled) return;
				const locationOptions: LocationOption[] = [
					...warehouses.map((warehouse) => ({
						locationId: warehouse._id,
						name: warehouse.name,
						locationType: 'Warehouse' as const
					})),
					...shops.map((shop) => ({
						locationId: shop._id,
						name: shop.name,
						locationType: 'Shop' as const
					}))
				];
				transferStore.setLocations(locationOptions);
			})
			.catch(() => {
				if (!cancelled) toast.error('Failed to load transfer locations');
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

	let filteredProducts = $derived(
		products.filter((p) => {
			const isActive = p.status === 'Active';
			if (!isActive) return false;
			if (!searchQuery.trim()) return true;

			const q = searchQuery.toLowerCase();
			return (
				p.name.toLowerCase().includes(q) ||
				p.sku?.toLowerCase().includes(q) ||
				p.code.toLowerCase().includes(q)
			);
		})
	);

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

	<!-- Line Items Builder -->
	<div class="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
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

					{#if filteredProducts.length === 0}
						<p class="p-3 text-center text-xs text-muted-foreground">No active products found.</p>
					{:else}
						{#each filteredProducts as product (product._id)}
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-sm p-2 text-left hover:bg-accent"
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
											{product.code} | Qty: {product.totalQuantity}
										</p>
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
					<div class="flex items-end gap-2">
						<div class="flex flex-1 flex-col gap-1.5">
							<Label class="text-[11px]">Item</Label>
							<Input type="text" readonly bind:value={item.name} class="h-9 text-xs" />
						</div>

						<div class="flex w-30 flex-col gap-1.5">
							<Label class="text-[11px]">Code</Label>
							<Input type="text" readonly bind:value={item.code} class="h-9 text-xs" />
						</div>

						<div class="flex w-18 flex-col gap-1.5">
							<Label class="text-[11px]">Quantity</Label>
							<Input
								type="number"
								min="1"
								placeholder="Qty"
								bind:value={item.totalQuantity}
								class="h-9 text-xs"
							/>
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
