<script lang="ts">
	// import type { Shop } from '$lib/types/shop.types';
	import type { Product } from '$lib/types/product.types';
	import { formatCurrency } from '$lib/utils';

	import { Badge } from '$lib/components/ui/badge';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import Store from '@lucide/svelte/icons/store';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Package from '@lucide/svelte/icons/package';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import FileText from '@lucide/svelte/icons/file-text';
	import Boxes from '@lucide/svelte/icons/boxes';

	import LogFooter from '$lib/components/common/LogFooter.svelte';
	import ProductsTable from '$lib/components/modules/products/products.table.svelte';
	import type { PageProps } from './$types';

	// type Props = {
	// 	selectedShop?: Shop | null;
	// };

	let { data }: PageProps = $props();

	const selectedShop = $derived(data.shop);


	// Derived status variant
	const statusVariant = $derived(
		selectedShop?.status === 'Active'
			? 'default'
			: selectedShop?.status === 'Under Maintenance'
				? 'secondary'
				: 'outline'
	);

	// Filter populated Product objects from string IDs safely
	const populatedProducts = $derived.by<Product[]>(() => {
		if (!selectedShop?.inventoryItems) return [];
		return selectedShop.inventoryItems.filter(
			(item): item is Product => typeof item === 'object' && item !== null && '_id' in item
		);
	});
</script>

{#if selectedShop}
	<div class="space-y-6 p-1">
		<!-- Shop Header Card -->
		<div class="rounded-xl border bg-card p-5 shadow-sm">
			<div class="flex items-start justify-between gap-4">
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<Badge
							variant={statusVariant}
							class={selectedShop.status === 'Active'
								? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400'
								: ''}
						>
							{selectedShop.status}
						</Badge>
					</div>
					<h2 class="text-xl font-bold tracking-tight text-foreground">{selectedShop.name}</h2>
					<p class="flex items-center gap-1.5 text-xs text-muted-foreground">
						<Store class="size-3.5 text-primary" />
						{selectedShop.type}
					</p>
				</div>
			</div>
		</div>

		<!-- Quick Stock Metrics Grid -->
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			<!-- Total Stock Value -->
			<div class="rounded-lg border bg-card p-3 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<DollarSign class="size-3.5 text-primary" /> Stock Value
				</div>
				<p class="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
					{formatCurrency(selectedShop.inventorySummary?.totalStockValue ?? 0)}
				</p>
			</div>

			<!-- Total Units -->
			<div class="rounded-lg border bg-card p-3 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<Package class="size-3.5 text-primary" /> Total Units
				</div>
				<p class="mt-1 text-sm font-bold text-foreground">
					{(selectedShop.inventorySummary?.totalItemsInStock ?? 0).toLocaleString()}
				</p>
			</div>

			<!-- Low Stock Alert -->
			<div class="rounded-lg border bg-card p-3 shadow-sm">
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
			<div class="flex items-center justify-between">
				<h3
					class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
				>
					<Boxes class="size-4 text-primary" /> Inventory Items
				</h3>
				<span class="text-xs font-medium text-muted-foreground">
					{populatedProducts.length} Products
				</span>
			</div>
			<Separator />

			{#if populatedProducts.length > 0}
				<ProductsTable
					filteredProducts={populatedProducts}
					// shopId={selectedShop._id}
				/>
			{:else}
				<div class="py-8 text-center text-xs text-muted-foreground">
					No detailed product records loaded for this shop.
				</div>
			{/if}
		</div>

		<!-- Location & Address -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<MapPin class="size-4 text-primary" /> Location
			</h3>
			<Separator />

			<div class="space-y-3 text-xs">
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground">Town/City</span>
					<span class="font-medium text-foreground">{selectedShop.address.town}</span>
				</div>

				<div class="flex items-start justify-between gap-4">
					<span class="text-muted-foreground">Building</span>
					<span class="text-right font-medium text-foreground">
						{selectedShop.address.building || 'N/A'}
					</span>
				</div>
			</div>
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
