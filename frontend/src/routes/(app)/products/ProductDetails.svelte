<script lang="ts">
	import type { Product } from '$lib/types/product.types';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Card } from '$lib/components/ui/card';
	import { formatCurrency } from '$lib/utils';

	// Lucide Icons
	import Package from '@lucide/svelte/icons/package';
	import Palette from '@lucide/svelte/icons/palette';
	import Barcode from '@lucide/svelte/icons/barcode';
	import Layers from '@lucide/svelte/icons/layers';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import Warehouse from '@lucide/svelte/icons/warehouse';
	import Store from '@lucide/svelte/icons/store';
	import LogFooter from '$lib/components/common/LogFooter.svelte';

	type Props = {
		selectedProduct: Product | null;
	};

	let { selectedProduct }: Props = $props();

	// Active image index for carousel state
	let activeImageIndex = $state(0);

	let images = $derived(selectedProduct?.image ?? []);
	let inventory = $derived(selectedProduct?.inventory ?? []);

	// Safety check to reset carousel index when switching products
	$effect(() => {
		if (activeImageIndex >= images.length) {
			activeImageIndex = 0;
		}
	});

	function nextImage() {
		if (images.length > 0) {
			activeImageIndex = (activeImageIndex + 1) % images.length;
		}
	}

	function prevImage() {
		if (images.length > 0) {
			activeImageIndex = (activeImageIndex - 1 + images.length) % images.length;
		}
	}
</script>

{#if selectedProduct}
	<div class="space-y-6 py-2">
		<!-- 1. Image Carousel / Gallery -->
		<div class="space-y-2">
			<div class="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
				{#if images.length > 0}
					<img
						src={images[activeImageIndex]}
						alt={selectedProduct.name}
						class="h-full w-full object-cover transition-all duration-300"
					/>

					<!-- Status Badge Overlay -->
					<div class="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
						<Badge
							variant={selectedProduct.status === 'Active' ? 'default' : 'secondary'}
							class={selectedProduct.status === 'Active'
								? 'bg-emerald-600 text-white hover:bg-emerald-700'
								: ''}
						>
							{selectedProduct.status}
						</Badge>

						{#if selectedProduct.totalQuantity < 5}
							<Badge
								variant="secondary"
								class="flex items-center gap-1 border-amber-500/30 bg-red-500 text-xs font-medium text-white"
							>
								<TriangleAlert class="size-3" />
								Low Stock
							</Badge>
						{/if}
					</div>

					<!-- Carousel Controls -->
					{#if images.length > 1}
						<button
							onclick={prevImage}
							class="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow-md backdrop-blur transition-all hover:bg-background"
							aria-label="Previous image"
						>
							<ChevronLeft class="size-4" />
						</button>

						<button
							onclick={nextImage}
							class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow-md backdrop-blur transition-all hover:bg-background"
							aria-label="Next image"
						>
							<ChevronRight class="size-4" />
						</button>

						<div
							class="absolute right-2 bottom-2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs text-white backdrop-blur"
						>
							{activeImageIndex + 1} / {images.length}
						</div>
					{/if}
				{:else}
					<div
						class="flex h-full w-full flex-col items-center justify-center text-muted-foreground"
					>
						<Package class="size-10 stroke-1" />
						<span class="mt-2 text-xs">No product images available</span>
					</div>
				{/if}
			</div>

			<!-- Thumbnail Strip -->
			{#if images.length > 1}
				<div class="flex items-center gap-2 overflow-x-auto pb-1">
					{#each images as img, i (i)}
						<button
							onclick={() => (activeImageIndex = i)}
							class="relative aspect-square size-14 shrink-0 overflow-hidden rounded-md border-2 transition-all {activeImageIndex ===
							i
								? 'border-primary'
								: 'border-transparent opacity-60 hover:opacity-100'}"
						>
							<img src={img} alt="" class="h-full w-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- 2. Price & Total Stock Stat Cards -->
		<div class="grid grid-cols-3 gap-3">
			<Card class="bg-muted/40 p-2 shadow-none">
				<p class="text-xs font-medium text-muted-foreground">Selling Price</p>
				<p class="text-md font-bold text-green-500">
					{formatCurrency(selectedProduct.sellingPrice)}
				</p>
			</Card>

			<Card class="bg-muted/40 p-2 shadow-none">
				<p class="text-xs font-medium text-muted-foreground">Cost Price</p>
				<p class="text-md font-bold text-red-400">
					{formatCurrency(selectedProduct.costPrice)}
				</p>
			</Card>

			<Card class="bg-muted/40 p-2 shadow-none">
				<p class="mb-0.5 text-xs font-medium text-muted-foreground">Stock Level</p>

				<div class="flex items-center gap-2">
					<span
						class={selectedProduct.totalQuantity < 5
							? 'text-md font-bold text-amber-600'
							: 'text-md font-bold'}>{selectedProduct.totalQuantity}</span
					>
				</div>
			</Card>
		</div>

		<!-- 3. Multi-Location Inventory Breakdown -->
		<div class="space-y-2 rounded-xl border bg-muted/20 p-3">
			<div class="flex items-center justify-between">
				<p class="text-xs font-semibold text-foreground">Stock Breakdown by Location</p>
				<span class="text-[11px] text-muted-foreground">{inventory.length} Locations</span>
			</div>

			<div class="space-y-1.5 pt-1">
				{#each inventory as loc (loc.locationId)}
					<div
						class="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-xs shadow-sm"
					>
						<div class="flex items-center gap-2">
							{#if loc.locationType === 'Warehouse'}
								<Warehouse class="size-3.5 text-muted-foreground" />
							{:else}
								<Store class="size-3.5 text-muted-foreground" />
							{/if}
							<div>
								<span class="font-medium">{loc.locationId}</span>
								<span class="ml-1 text-[10px] text-muted-foreground">({loc.locationType})</span>
							</div>
						</div>
						<span class="font-bold text-foreground">{loc.quantity} pcs</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- 4. Specifications Grid -->
		<div class="grid grid-cols-3 items-center gap-x-2 gap-y-4 text-sm">
			<div class="flex items-start gap-2.5">
				<Barcode class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
				<div>
					<p class="text-xs text-muted-foreground">SKU</p>
					<p class="font-medium">{selectedProduct.sku ? selectedProduct.sku : 'N/A'}</p>
				</div>
			</div>

			<div class="flex items-start gap-2.5">
				<Layers class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
				<div>
					<p class="text-xs text-muted-foreground">Category</p>
					<p class="font-medium">{selectedProduct.category || 'Uncategorized'}</p>
				</div>
			</div>

			{#if selectedProduct.colour}
				<div class="flex items-start gap-2.5">
					<Palette class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
					<div>
						<p class="text-xs text-muted-foreground">Colour</p>
						<p class="font-medium">{selectedProduct.colour}</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- 5. Description -->
		{#if selectedProduct.description}
			<Separator />
			<div>
				<p class="mb-1.5 text-xs font-medium text-muted-foreground">Description</p>
				<div class="rounded-lg border bg-muted/20 p-3 text-xs leading-relaxed text-foreground">
					{selectedProduct.description}
				</div>
			</div>
		{/if}

		<!-- 6. Metadata Footer -->
		<LogFooter
			createTimestamp={selectedProduct.createdAt
				? selectedProduct.createdAt
				: new Date().toISOString()}
			updateTimestamp={selectedProduct.updatedAt
				? selectedProduct.updatedAt
				: new Date().toISOString()}
		/>
	</div>
{/if}
