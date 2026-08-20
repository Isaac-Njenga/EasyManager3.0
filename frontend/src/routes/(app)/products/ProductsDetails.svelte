<script lang="ts">
	import type { Product } from '$lib/types/product.types';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Card } from '$lib/components/ui/card';
	import { format } from 'date-fns';
	// import ImagePreview from '$lib/components/common/ImagePreview.svelte';

	// Lucide Icons
	// import Tag from 'lucide-static/icons/tag.svg?raw'; // or standard @lucide/svelte icons
	import Package from '@lucide/svelte/icons/package';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Palette from '@lucide/svelte/icons/palette';
	import Barcode from '@lucide/svelte/icons/barcode';
	import Layers from '@lucide/svelte/icons/layers';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

	type Props = {
		selectedProduct: Product | null;
	};

	let { selectedProduct }: Props = $props();

	// Active image index for carousel state
	let activeImageIndex = $state(0);

	let images = $derived(selectedProduct?.image ?? []);

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

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
			minimumFractionDigits: 2
		}).format(amount);
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

						{#if selectedProduct.quantity < 5}
							<Badge
								variant="secondary"
								class="flex items-center gap-1 border-amber-500/30 bg-red-500 text-xs font-medium text-white"
							>
								<TriangleAlert class="size-3" />
								Low Stock
							</Badge>
						{/if}
					</div>

					<!-- Carousel Controls (Show if multiple images) -->
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

						<!-- Counter Pill -->
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
								? 'border-primary '
								: 'border-transparent opacity-60 hover:opacity-100'}"
						>
							<img src={img} alt="" class="h-full w-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- 2. Price & Inventory Stat Cards -->
		<div class="grid grid-cols-3 gap-3">
			<Card class="bg-muted/40 p-2 shadow-none">
				<p class="text-xs font-medium text-muted-foreground">Selling Price</p>
				<p class="text-md mt-0 font-bold text-green-600">
					{formatCurrency(selectedProduct.sellingPrice)}
				</p>
			</Card>

			<Card class="bg-muted/40 p-2 shadow-none">
				<p class="text-xs font-medium text-muted-foreground">Cost Price</p>
				<p class="text-md mt-0 font-bold text-red-400">
					{formatCurrency(selectedProduct.costPrice)}
				</p>
			</Card>

			<Card class="bg-muted/40 p-2 shadow-none">
				<p class="mb-0.5 text-xs font-medium text-muted-foreground">Stock Level</p>

				<div class="flex items-center gap-2">
					<span
						class={selectedProduct.quantity < 5
							? 'text-md font-bold text-amber-600'
							: 'text-md font-bold'}>{selectedProduct.quantity}</span
					>
				</div>
			</Card>
		</div>

		<Separator />

		<!-- 3. Details Grid -->
		<div class="grid grid-cols-2 gap-x-2 gap-y-4 text-sm">
			<div class="flex items-start gap-2.5">
				<Barcode class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
				<div>
					<p class="text-xs text-muted-foreground">SKU</p>
					<p class="font-medium">{selectedProduct.sku}</p>
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

			{#if selectedProduct.location}
				<div class="flex items-start gap-2.5">
					<MapPin class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
					<div>
						<p class="text-xs text-muted-foreground">Location</p>
						<p class="font-medium">{selectedProduct.location}</p>
					</div>
				</div>
			{/if}

			<!-- {#if selectedProduct.costPrice}
				<div class="flex items-start gap-2.5">
					<DollarSign class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
					<div>
						<p class="text-xs text-muted-foreground">Cost Price</p>
						<p class="font-medium">{formatCurrency(selectedProduct.costPrice)}</p>
					</div>
				</div>
			{/if} -->
		</div>

		<!-- 4. Description -->
		{#if selectedProduct.description}
			<Separator />
			<div>
				<p class="mb-1.5 text-xs font-medium text-muted-foreground">Description</p>
				<div class="rounded-lg border bg-muted/20 p-3 text-xs leading-relaxed text-foreground">
					{selectedProduct.description}
				</div>
			</div>
		{/if}

		<!-- 5. Metadata Footer -->
		<div class="space-y-1 rounded-lg border bg-muted/10 p-3 text-[11px] text-muted-foreground">
			<div class="flex justify-between">
				<span>Created:</span>
				<span class="font-medium text-foreground"
					>{format(new Date(selectedProduct.createdAt), 'PPPp')}</span
				>
			</div>
			<div class="flex justify-between">
				<span>Last Updated:</span>
				<span class="font-medium text-foreground"
					>{format(new Date(selectedProduct.updatedAt), 'PPPp')}</span
				>
			</div>
		</div>
	</div>
{/if}
