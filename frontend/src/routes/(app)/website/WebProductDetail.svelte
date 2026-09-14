<script lang="ts">
	import type { WebProduct } from '$lib/services/website/website.types';
	import { formatCurrency } from '$lib/utils';
	import { Check, ChevronLeft, ChevronRight } from '@lucide/svelte';

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
	<div class="relative grid grid-cols-1 gap-4 p-4 sm:gap-8 sm:p-4 md:grid-cols-2">
		<div class="flex min-w-0 flex-col gap-3">
			<div
				class="group relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 shadow-inner dark:bg-slate-800"
			>
				<img
					src={images[selectedImgIndex]}
					alt={product.name}
					class="h-full w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
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
				<div class="flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
					{#each images as img, i (img)}
						<button
							type="button"
							onclick={() => (selectedImgIndex = i)}
							aria-label={`Show image ${i + 1}`}
							class="size-14 shrink-0 overflow-hidden rounded-none border-2 transition-all sm:size-16 {selectedImgIndex ===
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
						<span class="text-base text-muted-foreground line-through">
							{formatCurrency(product.price)}
						</span>
					{/if}
				</div>

				<!-- Description & Specs -->
				<p class="mt-4 text-sm leading-relaxed text-muted-foreground">
					{product.description ||
						'Elevate your living space with this expertly crafted piece from EasyDeal Furniture. Modern design meets durable ergonomics.'}
				</p>

				<div class="mt-4 space-y-2 text-xs text-foreground/80">
					<p class="flex items-center gap-1.5 font-semibold text-emerald-600">
						<Check class="h-4 w-4" /> In Stock & Ready for delivery
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}
