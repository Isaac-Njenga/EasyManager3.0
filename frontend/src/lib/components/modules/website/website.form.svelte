<script lang="ts">
	import type {
		WebProduct,
		CreateWebProductInput,
		WebProductCategory
	} from '$lib/services/website/website.types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import ImageUpload from '$lib/components/common/ImageUpload.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';
	import PencilSparkles from '@lucide/svelte/icons/pencil-sparkles';

	type Props = {
		webProduct?: WebProduct;
		onSubmit: (payload: CreateWebProductInput) => Promise<void> | void;
		isSubmitting?: boolean;
	};

	let { webProduct, onSubmit, isSubmitting = false }: Props = $props();

	const categoryOptions: { value: WebProductCategory; label: string }[] = [
		{ value: 'Office Furniture', label: 'Office Furniture' },
		{ value: 'Kitchen Furniture', label: 'Kitchen Furniture' },
		{ value: 'Living Room Furniture', label: 'Living Room Furniture' },
		{ value: 'Outdoor Furniture', label: 'Outdoor Furniture' },
		{ value: 'Second-Hand Items', label: 'Second-Hand Items' },
		{ value: 'Bedroom Furniture', label: 'Bedroom Furniture' }
	];

	let name = $state('');
	let colours = $state<string[]>([]);
	let colourInput = $state('');
	let image = $state<string[]>([]);

	let price = $state('');
	let discount = $state('0');
	let description = $state('');
	let category: WebProductCategory | string = $state<WebProductCategory>('Office Furniture');
	let inStock = $state(true);
	let isBestSeller = $state(false);
	let isNewArrival = $state(false);

	let errors = $state<Record<string, string>>({});

	$effect(() => {
		if (webProduct) {
			name = webProduct.name ?? '';
			colours = webProduct.colours ? [...webProduct.colours] : [];
			image = webProduct.image ? [...webProduct.image] : [];
			description = webProduct.description ?? '';
			category = webProduct.category ?? 'Office Furniture';
			price = webProduct.price?.toString() ?? '';
			discount = webProduct.discount?.toString() ?? '0';
			inStock = webProduct.inStock ?? true;
			isBestSeller = webProduct.isBestSeller ?? false;
			isNewArrival = webProduct.isNewArrival ?? false;
		}
	});

	const categoryTriggerContent = $derived(
		categoryOptions.find((s) => s.value === category)?.label ?? 'Select category'
	);

	// Multi-color handling
	function addColour() {
		const trimmed = colourInput.trim();
		if (trimmed && !colours.includes(trimmed)) {
			colours = [...colours, trimmed];
			colourInput = '';
		}
	}

	function removeColour(colorToRemove: string) {
		colours = colours.filter((c) => c !== colorToRemove);
	}

	function handleColourKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addColour();
		}
	}

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) newErrors.name = 'Product name is required';
		if (!category.trim()) newErrors.category = 'Category is required';
		if (!description.trim()) newErrors.description = 'A description is required';
		if (!price || Number(price) <= 0) newErrors.price = 'Valid selling price is required';
		if (image.length === 0) newErrors.image = 'At least one product image is required';

		const numDiscount = Number(discount);
		if (isNaN(numDiscount) || numDiscount < 0 || numDiscount > 100) {
			newErrors.discount = 'Discount must be between 0% and 100%';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!validate()) return;

		const payload: CreateWebProductInput = {
			name: name.trim(),
			colours: [...colours],
			image: [...image],
			description: description.trim(),
			category,
			price: Number(price),
			discount: Number(discount),
			inStock,
			isBestSeller,
			isNewArrival
		};

		await onSubmit(payload);
	}
</script>

<form onsubmit={handleFormSubmit} novalidate class="space-y-6">
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
		<!-- Media Column -->
		<div class="space-y-6 lg:col-span-5">
			<Card>
				<CardHeader>
					<CardTitle>Product Images <span class="text-destructive">*</span></CardTitle>
				</CardHeader>
				<CardContent>
					<ImageUpload bind:selectedImages={image} />
					{#if errors.image}
						<p class="mt-2 text-xs text-destructive">{errors.image}</p>
					{/if}
				</CardContent>
			</Card>
		</div>

		<!-- Details Column -->
		<div class="space-y-6 lg:col-span-7">
			<Card>
				<CardHeader>
					<CardTitle>Product Information</CardTitle>
				</CardHeader>

				<CardContent class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-2 sm:col-span-2">
						<Label for="name">Product Name <span class="text-destructive">*</span></Label>
						<Input id="name" bind:value={name} aria-invalid={!!errors.name} />
						{#if errors.name}
							<p class="text-xs text-destructive">{errors.name}</p>
						{/if}
					</div>

					<!-- Multi-Color Array Input -->
					<div class="space-y-2 sm:col-span-2">
						<Label for="colour">Available Colours</Label>
						<div class="flex gap-2">
							<Input
								id="colour"
								bind:value={colourInput}
								onkeydown={handleColourKeydown}
								placeholder="Type a color (e.g. Matte Black) and press Enter"
							/>
							<Button type="button" variant="secondary" onclick={addColour}>
								<Plus class="size-4" />
							</Button>
						</div>
						{#if colours.length > 0}
							<div class="mt-2 flex flex-wrap gap-1.5">
								{#each colours as col (col)}
									<Badge variant="outline" class="flex items-center gap-1.5 px-2.5 py-1">
										{col}
										<button
											type="button"
											class="rounded-full hover:bg-muted"
											onclick={() => removeColour(col)}
										>
											<X class="size-3" />
										</button>
									</Badge>
								{/each}
							</div>
						{/if}
					</div>

					<div class="space-y-2 sm:col-span-2">
						<Label for="category">Category <span class="text-destructive">*</span></Label>
						<Select.Root type="single" name="category" bind:value={category}>
							<Select.Trigger
								class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
							>
								{categoryTriggerContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each categoryOptions as s (s.value)}
										<Select.Item value={s.value} label={s.label}>
											{s.label}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
						{#if errors.category}
							<p class="text-xs text-destructive">{errors.category}</p>
						{/if}
					</div>

					<div class="space-y-2 sm:col-span-2">
						<div class="flex flex-row justify-between">
							<Label for="description">Description</Label>
							<Button variant="outline" onclick={() => console.log('Njeri')}
								><PencilSparkles class="size-4" /></Button
							>
						</div>
						<Textarea
							id="description"
							bind:value={description}
							placeholder="Describe dimensions, materials, and features..."
							aria-invalid={!!errors.description}
							rows={4}
						/>{#if errors.name}
							<p class="text-xs text-destructive">{errors.description}</p>
						{/if}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Pricing & Discount</CardTitle>
				</CardHeader>

				<CardContent class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-2">
						<Label for="sellingPrice"
							>Selling Price (KES) <span class="text-destructive">*</span></Label
						>
						<Input
							id="sellingPrice"
							type="number"
							min="0"
							step="0.01"
							bind:value={price}
							placeholder="0.00"
							aria-invalid={!!errors.price}
						/>
						{#if errors.price}
							<p class="text-xs text-destructive">{errors.price}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="discount">Discount Percentage (%)</Label>
						<div class="relative">
							<Input
								id="discount"
								type="number"
								min="0"
								max="100"
								step="1"
								bind:value={discount}
								placeholder="0"
								aria-invalid={!!errors.discount}
							/>
						</div>
						{#if errors.discount}
							<p class="text-xs text-destructive">{errors.discount}</p>
						{/if}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Homepage Display Options</CardTitle>
				</CardHeader>
				<CardContent class="grid gap-4 sm:grid-cols-2">
					<div class="flex items-center justify-between rounded-lg border p-3">
						<div class="space-y-0.5">
							<Label for="bestSeller">Best Seller</Label>
							<p class="text-xs text-muted-foreground">Featured in homepage Best Sellers (Max 8)</p>
						</div>
						<Switch id="bestSeller" bind:checked={isBestSeller} />
					</div>

					<div class="flex items-center justify-between rounded-lg border p-3">
						<div class="space-y-0.5">
							<Label for="newArrival">New Arrival</Label>
							<p class="text-xs text-muted-foreground">Featured in New Arrivals (Max 8)</p>
						</div>
						<Switch id="newArrival" bind:checked={isNewArrival} />
					</div>
				</CardContent>
			</Card>
		</div>
	</div>

	<Separator />

	<div class="flex justify-end gap-3">
		<Button type="button" variant="outline" href="/website" size="lg">Cancel</Button>

		<Button type="submit" disabled={isSubmitting} size="lg">
			{isSubmitting ? 'Saving...' : webProduct ? 'Update Product' : 'Create Product'}
		</Button>
	</div>
</form>
