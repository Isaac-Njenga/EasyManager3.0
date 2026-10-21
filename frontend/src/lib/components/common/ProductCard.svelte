<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { formatCurrency } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import type { WebProduct } from '$lib/services/website/website.types';

	type Props = {
		item: WebProduct;
		handleViewItem: (product: WebProduct) => void;
	};

	let { item, handleViewItem }: Props = $props();

	let activeImgIndex = $state(0);
	let isCarouselPaused = $state(false);

	const images = $derived(Array.isArray(item.image) ? item.image : [item.image]);
	const hasMultipleImages = $derived(images.length > 1);
	const hasDiscount = $derived(item.discount > 0);
	const discountedPrice = $derived(
		hasDiscount ? item.price * (1 - item.discount / 100) : item.price
	);

	const advanceImage = () => {
		if (images.length > 1) {
			activeImgIndex = (activeImgIndex + 1) % images.length;
		}
	};

	let intervalId: ReturnType<typeof setInterval>;

	onMount(() => {
		intervalId = setInterval(() => {
			if (!isCarouselPaused) advanceImage();
		}, 4500);
	});

	onDestroy(() => clearInterval(intervalId));

	const nextImage = (e: MouseEvent) => {
		e.stopPropagation();
		advanceImage();
	};

	const prevImage = (e: MouseEvent) => {
		e.stopPropagation();
		activeImgIndex = (activeImgIndex - 1 + images.length) % images.length;
	};
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-none border border-border bg-card shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
>
	<!-- Product Image & Carousel Area -->
	<div
		class="relative aspect-4/4 w-full overflow-hidden bg-muted"
		role="group"
		aria-label={`${item.name} image carousel`}
		onmouseenter={() => (isCarouselPaused = true)}
		onmouseleave={() => (isCarouselPaused = false)}
		onfocusin={() => (isCarouselPaused = true)}
		onfocusout={() => (isCarouselPaused = false)}
	>
		{#key images[activeImgIndex]}
			<img
				src={images[activeImgIndex]}
				alt={item.name}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
				transition:fade={{ duration: 450 }}
			/>
		{/key}

		<!-- Image Carousel Navigation Controls -->
		{#if hasMultipleImages}
			<div
				class="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			>
				<button
					type="button"
					onclick={prevImage}
					aria-label="Previous image"
					class="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-xs hover:bg-black"
				>
					<ChevronLeft class="h-4 w-4" />
				</button>
				<button
					type="button"
					onclick={nextImage}
					aria-label="Next image"
					class="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-xs hover:bg-black"
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>

			<!-- Dots Indicator -->
			<div class="absolute inset-x-0 bottom-2 flex justify-center gap-1">
				{#each images as image, i (image)}
					<span
						class="h-1.5 rounded-full transition-all {i === activeImgIndex
							? 'w-4 bg-primary'
							: 'w-1.5 bg-white/60'}"
					></span>
				{/each}
			</div>
		{/if}

		<!-- Discount Badge (Top Left) -->
		{#if hasDiscount}
			<span
				class="absolute top-3 left-3 z-10 rounded-md bg-primary px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-primary-foreground uppercase shadow-md"
			>
				{item.discount}% OFF
			</span>
		{/if}
	</div>

	<!-- Card Body -->
	<div class="flex flex-1 flex-col justify-between p-3">
		<div>
			<h3
				class="font-roboto line-clamp-1 text-base font-bold text-foreground capitalize transition-colors group-hover:text-primary"
			>
				{item.name}
			</h3>

			<!-- Pricing Section -->
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-lg font-extrabold text-primary">
					{formatCurrency(discountedPrice)}
				</span>
				{#if hasDiscount}
					<span class="text-sm font-medium text-muted-foreground line-through">
						{formatCurrency(item.price)}
					</span>
				{/if}
			</div>
		</div>

		<!-- Transparent Action Button -->
		<div class="mt-4">
			<Button
				variant="outline"
				onclick={() => handleViewItem(item)}
				class="w-full rounded-none border-border bg-transparent font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
			>
				View
			</Button>
		</div>
	</div>
</div>
