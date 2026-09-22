<script lang="ts">
	import type { WebProduct } from '$lib/services/website/website.types';
	import { formatCurrency } from '$lib/utils';
	import { ChevronLeft, ChevronRight, Tag } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';

	type Props = {
		product: WebProduct | null;
		isOpen: boolean;
	};

	let { product, isOpen }: Props = $props();

	let selectedImgIndex = $state(0);

	const images = $derived(
		product ? (Array.isArray(product.image) ? product.image : [product.image]) : []
	);
	const hasDiscount = $derived(product ? product.discount > 0 : false);
	const discountedPrice = $derived(
		product && hasDiscount ? product.price * (1 - product.discount / 100) : (product?.price ?? 0)
	);

	$effect(() => {
		if (product) {
			selectedImgIndex = 0;
		}
	});
</script>

{#if isOpen && product}
	<div class="relative grid grid-cols-1 gap-2 p-1 sm:gap-8 sm:p-2 md:grid-cols-2">
		<div class="flex h-full min-w-0 flex-col gap-3">
			<div
				class="group relative aspect-4/3 h-full w-full overflow-hidden rounded-none bg-muted shadow-inner"
			>
				<img
					src={images[selectedImgIndex]}
					alt={product.name}
					class="h-full w-full rounded-none object-cover transition-transform duration-600 group-hover:scale-105 motion-reduce:transition-none"
				/>
				{#if hasDiscount}
					<span
						class="absolute top-3 left-3 rounded-md bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground uppercase shadow-md"
					>
						{product.discount}% OFF
					</span>
				{/if}
				{#if images.length > 1}
					<button
						type="button"
						onclick={() =>
							(selectedImgIndex = (selectedImgIndex - 1 + images.length) % images.length)}
						aria-label="Previous product image"
						class="absolute top-1/2 left-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white"
					>
						<ChevronLeft class="size-4" />
					</button>
					<button
						type="button"
						onclick={() => (selectedImgIndex = (selectedImgIndex + 1) % images.length)}
						aria-label="Next product image"
						class="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white"
					>
						<ChevronRight class="size-4" />
					</button>
				{/if}
			</div>

			{#if images.length > 1}
				<div class="overflow-x-none flex gap-2 pb-1" aria-label="Product images">
					{#each images as img, i (img)}
						<button
							type="button"
							onclick={() => (selectedImgIndex = i)}
							aria-label={`Show image ${i + 1}`}
							class="size-12 shrink-0 overflow-hidden rounded-none border-2 transition-all sm:size-12 {selectedImgIndex ===
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

		<div class="flex min-w-0 flex-col justify-between">
			<div>
				<span class="text-xs font-bold tracking-widest text-primary uppercase">
					{product.category || 'Furniture'}
				</span>
				<h2 class="font-roboto mt-1 pr-10 text-xl font-extrabold text-foreground sm:text-2xl">
					{product.name}
				</h2>

				<!-- Price -->
				<div class="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span class="text-2xl font-black text-foreground sm:text-3xl">
						{formatCurrency(discountedPrice)}
					</span>
					{#if hasDiscount}
						<span class="text-base text-red-400 line-through">
							{formatCurrency(product.price)}
						</span>
					{/if}
				</div>

				<!-- Description & Specs -->
				<p class="mt-4 text-sm leading-relaxed text-muted-foreground">
					{product.description ||
						'Elevate your living space with this expertly crafted piece from EasyDeal Furniture. Modern design meets durable ergonomics.'}
				</p>

				<div class="mt-4 flex flex-wrap items-center gap-2">
					<div class="flex items-center gap-1.5 text-sm font-medium text-foreground">
						<Tag class="size-3.5 shrink-0 text-primary" />
					</div>

					<div class=" flex flex-wrap items-center gap-2 text-xs">
						{#each product.tags as tag (tag)}
							<Badge variant="outline" class="cursor-pointer whitespace-nowrap">
								{tag}
							</Badge>
						{/each}
					</div>
				</div>

				<p class="mt-4 text-xs leading-relaxed text-muted-foreground">
					Available Colours:
					<span class="capitalize"
						>{#each product.colours as color, i (color)}{color}{#if i < product.colours.length - 1},
							{/if}{/each}</span
					>
				</p>
			</div>
		</div>
	</div>
{/if}
