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
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
			<!-- Media Section -->
			<div class="flex h-full min-w-0 flex-col gap-4">
				<div
					class="group relative aspect-4/3 w-full overflow-hidden rounded-none bg-muted shadow-inner md:aspect-square"
				>
					<img
						src={images[selectedImgIndex]}
						alt={product.name}
						class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
					/>
					{#if hasDiscount}
						<span
							class="absolute top-4 left-4 rounded-md bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground uppercase shadow-md"
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
							class="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white"
						>
							<ChevronLeft class="size-5" />
						</button>
						<button
							type="button"
							onclick={() => (selectedImgIndex = (selectedImgIndex + 1) % images.length)}
							aria-label="Next product image"
							class="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white"
						>
							<ChevronRight class="size-5" />
						</button>
					{/if}
				</div>

				{#if images.length > 1}
					<div class="flex gap-3 overflow-x-auto pb-1" aria-label="Product images">
						{#each images as img, i (img)}
							<button
								type="button"
								onclick={() => (selectedImgIndex = i)}
								aria-label={`Show image ${i + 1}`}
								class="size-16 shrink-0 overflow-hidden rounded-md border-2 transition-all {selectedImgIndex ===
								i
									? 'border-primary ring-2 ring-primary/20'
									: 'border-transparent opacity-60 hover:opacity-100'}"
							>
								<img src={img} alt="" class="h-full w-full object-cover" />
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Product Information Section -->
			<div class="flex min-w-0 flex-col justify-between">
				<div class="space-y-2">
					<div>
						<span class="text-xs font-bold tracking-widest text-primary uppercase">
							{product.category || 'Furniture'}
						</span>
						<h1
							class="mt-1 font-roboto text-lg font-extrabold text-foreground capitalize sm:text-md lg:text-xl"
						>
							{product.name}
						</h1>
					</div>

					<!-- Pricing -->
					<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
						<span class="text-lg font-black text-primary sm:text-lg">
							{formatCurrency(discountedPrice)}
						</span>
						{#if hasDiscount}
							<span class="text-lg text-red-400 line-through">
								{formatCurrency(product.price)}
							</span>
						{/if}
					</div>

					<!-- Description -->
					<p class="text-justify text-sm text-base leading-relaxed text-muted-foreground">
						{product.description ||
							'Elevate your living space with this expertly crafted piece from EasyDeal Furniture. Modern design meets durable ergonomics.'}
					</p>

					<!-- Key features -->
					{#if product.keyFeatures && product.keyFeatures.length > 0}
						<p class="mb-0 pb-0 text-base text-sm leading-relaxed text-primary">Key Features</p>
						<ul class="list-disc pl-4 text-sm leading-relaxed text-muted-foreground">
							{#each product.keyFeatures as feature (feature)}
								<li>{feature}</li>
							{/each}
						</ul>
					{/if}

					<!-- Colors -->
					{#if product.colours && product.colours.length > 0}
						<div class="space-y-2">
							<p class="text-sm leading-relaxed text-primary">Available Colours</p>

							<div class="flex flex-wrap items-center gap-2">
								{#each product.colours as colour (colour)}
									<div
										class="group relative flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
									>
										<!-- Visual Swatch Dot -->
										<span
											class="size-4 rounded-lg border border-black/10 shadow-sm transition-transform group-hover:scale-110 dark:border-white/20"
											style="background-color: {colour.toLowerCase().replace(/\s+/g, '')};"
										></span>

										<!-- Colour Name Label -->
										<span class="capitalize">{colour}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Tags -->
					{#if product.tags && product.tags.length > 0}
						<div class="flex flex-wrap items-center gap-2">
							<!-- <Tag class="size-4 text-primary" /> -->
							<p class="text- leading-relaxed text-primary">Tags</p>
							<div class="flex flex-wrap items-center gap-1.5">
								{#each product.tags as tag (tag)}
									<Badge
										variant="outline"
										class="cursor-pointer whitespace-nowrap"
									>
										<Tag class="size-1 text-foreground" />
										{tag}
									</Badge>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				
			</div>
		</div>
{/if}
