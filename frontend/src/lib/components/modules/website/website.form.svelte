<script lang="ts">
	import { untrack } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import ImageUpload from '$lib/components/common/ImageUpload.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';
	import PencilSparkles from '@lucide/svelte/icons/pencil-sparkles';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { toast } from 'svelte-sonner';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import type {
		WebProduct,
		CreateWebProductInput,
		CreateDescriptionInput,
		GeneratedDescriptionResponse,
		// CatalogCategory
	} from '$lib/services/website/website.types';
	import type { Category } from '$lib/services/website/categories/categories.types';

	type Props = {
		webProduct?: WebProduct;
		onSubmit: (input: CreateWebProductInput) => Promise<void> | void;
		onDescriptionSubmit: (
			input: CreateDescriptionInput
		) => Promise<GeneratedDescriptionResponse | undefined> | void;
		isSubmitting?: boolean;
		isGenerating?: boolean;
		catalogCategories?: Category[];
	};

	let {
		webProduct,
		onSubmit,
		onDescriptionSubmit,
		isSubmitting = false,
		isGenerating = false,
		catalogCategories
	}: Props = $props();

	$effect(() => {
		if (!catalogCategories) {
			toast.error('There was an issue', { description: 'No categories provided to the form.' });
		}
		
	});

	const categoryOptions = $derived(
		catalogCategories?.map((c) => ({
			value: c._id,
			label: c.name
		}))
	);

	const publishingOptions: { value: string; label: string }[] = [
		{ value: 'DRAFT', label: 'Draft' },
		{ value: 'PUBLISHED', label: 'Published' },
		{ value: 'ARCHIVED', label: 'Archived' }
	];

	const initial = untrack(() => webProduct);

	let name = $state(initial?.name ?? '');
	let slug = $state(initial?.slug ?? '');
	// let category = $state<string>('')
	let category = $state(initial?.category?._id??'')
	let images = $state<string[]>(initial?.images ? [...initial.images] : []);
	let description = $state(initial?.description ?? '');
	let basePrice = $state<number | undefined>(initial?.pricing.basePrice);
	let currency = $state(initial?.pricing.currency ?? 'KES');
	let compareAtPrice = $state<number | undefined>(initial?.pricing.compareAtPrice ?? undefined);

	// let colours = $state<string[]>([]);
	let colours = $state<string[]>(initial?.colours?.length ? [...initial.colours] : []);

	let keyFeaturesInput = $state('');
	let tagInput = $state('');
	let colourInput = $state('');
	let tags = $state<string[]>(initial?.tags?.length ? [...initial.tags] : []);
	
	let keyFeatures = $state<string[]>(initial?.keyFeatures?.length ? [...initial.keyFeatures] : []);
	let specifications = $state<{ key: string; value: string }[]>(
		Object.entries(initial?.specifications ?? {}).map(([key, value]) => ({ key, value }))
	);
	let status = $state<WebProduct['status']>(initial?.status ?? 'DRAFT');
	let isFeatured = $state(initial?.merchandising.isFeatured ?? false);
	let isBestSeller = $state(initial?.merchandising.isBestSeller ?? false);
	let isNewArrival = $state(initial?.merchandising.isNewArrival ?? false);
	let sortOrder = $state(initial?.merchandising.sortOrder ?? 0);
	let metaTitle = $state(initial?.seo?.metaTitle ?? '');
	let metaDescription = $state(initial?.seo?.metaDescription ?? '');
	let generating = $state(false);

	let errors = $state<Record<string, string>>({});

	const categoryTriggerContent = $derived(
		categoryOptions?.find((s) => s.value === category)?.label ?? 'Select category'
	);

	const publishingTriggerContent = $derived(
		publishingOptions.find((s) => s.value === status)?.label ?? 'Select status'
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

	function addFeature() {
		const trimmed = keyFeaturesInput.trim();
		if (trimmed && !keyFeatures.includes(trimmed)) {
			keyFeatures = [...keyFeatures, trimmed];
			keyFeaturesInput = '';
		}
	}

	function removeFeature(featureToRemove: string) {
		keyFeatures = keyFeatures.filter((c) => c !== featureToRemove);
	}

	function handleFeatureKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addFeature();
		}
	}

	function addTag() {
		const trimmed = tagInput.trim();
		if (trimmed && !tags.includes(trimmed)) {
			tags = [...tags, trimmed];
			tagInput = '';
		}
	}

	function removeTag(tagToRemove: string) {
		tags = tags.filter((c) => c !== tagToRemove);
	}

	function handleTagKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addTag();
		}
	}

	const requiredFieldsConfig = [
		{ label: 'Product Name', getValue: () => name },
		{ label: 'Category', getValue: () => category },
		{ label: 'Base Price', getValue: () => basePrice }
	];

	async function handleGenerateDescription() {
		// event.preventDefault();

		const missingFields = requiredFieldsConfig
			.filter((field) => !field.getValue()?.toString().trim())
			.map((field) => field.label);

		if (missingFields.length > 0) {
			toast.error('Please fill in required fields to generate', {
				description: `Missing: ${missingFields.join(', ')}`
			});
			return;
		} else if (colours.length === 0) {
			toast.error('Please fill in at least one colour');
			return;
		}

		const selectedCategory = catalogCategories?.find((c) => c._id === category);
		const payload: CreateDescriptionInput = {
			name: name.trim(),
			colours: [...colours],
			category: selectedCategory ? selectedCategory._id : '',
			pricing: {
				basePrice: Number(basePrice),
				currency
			}
		};

		// console.log(payload);
		const result = await onDescriptionSubmit(payload);

		if (result) {
			if (result.description) {
				// const featuresText = result.keyFeatures?.length
				// 	? `\n\nKey Features:\n• ` + result.keyFeatures.join('\n• ')
				// 	: '';
				description = `${result.description}`;
			}

			if (result.slug) {
				slug = `${result.slug}`;
			}

			if (result.seo.metaTitle) {
				metaTitle = `${result.seo.metaTitle}`;
			}

			if (result.seo.metaDescription) {
				metaDescription = `${result.seo.metaDescription}`;
			}

			if (result.keyFeatures && result.keyFeatures.length > 0) {
				const combinedFeatures = new Set([...keyFeatures, ...result.keyFeatures]);
				keyFeatures = Array.from(combinedFeatures);
			}

			if (result.tags && result.tags.length > 0) {
				const combinedTags = new Set([...tags, ...result.tags]);
				tags = Array.from(combinedTags);
			}
		}
	}

	function readSpecifications(): Record<string, string> {
		const value: Record<string, string> = {};
		for (const row of specifications) {
			const key = row.key.trim();
			if (!key || /[.$]/.test(key) || ['__proto__', 'constructor', 'prototype'].includes(key))
				throw new Error('Each specification needs a valid name without dots or dollar signs.');
			if (Object.hasOwn(value, key)) throw new Error('Specification names must be unique.');
			value[key] = row.value;
		}
		return value;
	}
	function required(): void {
		if (
			!name.trim() ||
			!category ||
			basePrice === undefined ||
			!Number.isFinite(basePrice) ||
			basePrice < 0 ||
			!currency.trim()
		)
			throw new Error('Enter a name, category, currency, and base price of zero or greater.');
	}
	// async function generate() {
	// 	if (generating || isGenerating) return;
	// 	try {
	// 		required();
	// 		const input: CreateDescriptionInput = {
	// 			name: name.trim(),
	// 			category,
	// 			pricing: { basePrice: basePrice!, currency: currency.trim() },
	// 			colours: lines(colours),
	// 			keyFeatures: lines(keyFeatures),
	// 			specifications: readSpecifications()
	// 		};
	// 		generating = true;
	// 		const result = await onDescriptionSubmit(input);
	// 		if (result) {
	// 			description = result.description;
	// 			slug = result.slug;
	// 			metaTitle = result.seo.metaTitle;
	// 			metaDescription = result.seo.metaDescription;
	// 			tags = [...new Set([...lines(tags), ...result.tags])].join('\n');
	// 			keyFeatures = [...new Set([...lines(keyFeatures), ...result.keyFeatures])].join('\n');
	// 		}
	// 	} catch (error) {
	// 		toast.error(error instanceof Error ? error.message : 'Generation failed');
	// 	} finally {
	// 		generating = false;
	// 	}
	// }
	async function submit(event: SubmitEvent) {
		event.preventDefault();
		try {
			required();
			if (!slug.trim()) throw new Error('Slug is required.');
			if (compareAtPrice !== undefined && (!Number.isFinite(compareAtPrice) || compareAtPrice < 0))
				throw new Error('Compare-at price must be zero or greater.');
			if (!Number.isFinite(sortOrder)) throw new Error('Enter a valid sort order.');
			if (metaTitle.trim().length > 70 || metaDescription.trim().length > 320)
				throw new Error('SEO title is limited to 70 characters and description to 320.');
			await onSubmit({
				name: name.trim(),
				slug: slug.trim(),
				category,
				images: [...images],
				description: description.trim(),
				colours: [...colours],
				tags: [...tags],
				keyFeatures: [...keyFeatures],
				specifications: readSpecifications(),
				pricing: {
					currency: currency.trim(),
					basePrice: basePrice!,
					compareAtPrice: compareAtPrice ?? null
				},
				merchandising: { isFeatured, isBestSeller, isNewArrival, sortOrder },
				status,
				seo: { metaTitle: metaTitle.trim(), metaDescription: metaDescription.trim() }
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Could not save catalog item');
		}
	}
</script>

<form onsubmit={submit} class="space-y-6">
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
		<div class="space-y-6 lg:col-span-6">
			<!-- Media Column -->
			<Card>
				<CardHeader>
					<CardTitle>Product Images <span class="text-destructive">*</span></CardTitle>
				</CardHeader>
				<CardContent>
					<ImageUpload bind:selectedImages={images} />
					{#if errors.images}
						<p class="mt-2 text-xs text-destructive">{errors.images}</p>
					{/if}
				</CardContent>
			</Card>
		</div>

		<div class="space-y-6 lg:col-span-6">
			<!-- Product Information -->
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
						{/if}{#if errors.colours}
							<p class="text-xs text-destructive">{errors.colours}</p>
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
				</CardContent>
			</Card>

			<!-- Pricing & Specifications -->
			<Card>
				<CardHeader>
					<CardTitle>Pricing & Specifications</CardTitle>
				</CardHeader>

				<CardContent class="flex flex-col gap-6">
					<div class="space-y-2">
						<Label for="sellingPrice"
							>Base Price (KES) <span class="text-destructive">*</span></Label
						>
						<Input
							id="sellingPrice"
							type="number"
							min="0"
							step="0.01"
							bind:value={basePrice}
							placeholder="0.00"
							aria-invalid={!!errors.basePrice}
						/>
						{#if errors.basePrice}
							<p class="text-xs text-destructive">{errors.basePrice}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label>Specifications</Label>
						{#each specifications as row, index (row)}
							<div class="flex gap-2">
								<Input
									aria-label={`Specification ${index + 1} name`}
									placeholder="e.g. Width"
									bind:value={row.key}
								/>
								<Input
									aria-label={`Specification ${index + 1} value`}
									placeholder="e.g. 120 cm"
									bind:value={row.value}
								/>
								<Button
									type="button"
									variant="outline"
									onclick={() => (specifications = specifications.filter((_, i) => i !== index))}
									aria-label={`Remove specification ${index + 1}`}>Remove</Button
								>
							</div>
						{/each}
						<Button
							type="button"
							variant="outline"
							onclick={() => (specifications = [...specifications, { key: '', value: '' }])}
							>Add specification</Button
						>
					</div>

					<!-- <div class="space-y-2">
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
					</div> -->
				</CardContent>
			</Card>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
		<div class="space-y-6 lg:col-span-6">
			<!-- Meta Information -->
			<Card>
				<CardHeader>
					<CardTitle>Meta Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="flex flex-col gap-4">
						<div class="space-y-2 sm:col-span-2">
							<div class="flex flex-row justify-between">
								<Label for="description">Description</Label>
								<Button variant="outline" onclick={handleGenerateDescription}>
									{#if isGenerating}
										<LoaderCircle class="size-4 animate-spin" />
									{:else}
										<PencilSparkles class="size-4" />
									{/if}
								</Button>
							</div>
							<Textarea
								id="description"
								bind:value={description}
								placeholder="Describe dimensions, materials, and features..."
								aria-invalid={!!errors.description}
								rows={4}
								class="mb-2"
							/>
						</div>

						<div class="space-y-2 sm:col-span-2">
							<Label for="colour">Key Features</Label>
							<div class="flex gap-2">
								<Input
									id="feature"
									bind:value={keyFeaturesInput}
									onkeydown={handleFeatureKeydown}
									placeholder="Type a unique feature (e.g. Water Resistant) and press Enter"
									class="mb-2"
								/>
								<Button type="button" variant="secondary" onclick={addFeature}>
									<Plus class="size-4" />
								</Button>
							</div>
							{#if keyFeatures.length > 0}
								<div class="my-2 flex flex-wrap gap-1.5">
									{#each keyFeatures as feature (feature)}
										<Badge variant="outline" class="flex items-center gap-1.5 px-2.5 py-1">
											{feature}
											<button
												type="button"
												class="rounded-full hover:bg-muted"
												onclick={() => removeFeature(feature)}
											>
												<X class="size-3" />
											</button>
										</Badge>
									{/each}
								</div>
							{/if}
							{#if errors.keyFeatures}
								<p class="text-xs text-destructive">{errors.keyFeatures}</p>
							{/if}
						</div>

						<div class="space-y-2 sm:col-span-2">
							<Label for="colour">Tags</Label>
							<div class="flex gap-2">
								<Input
									id="tag"
									bind:value={tagInput}
									onkeydown={handleTagKeydown}
									placeholder="Type a tag (e.g. Brand New) and press Enter"
								/>
								<Button type="button" variant="secondary" onclick={addTag}>
									<Plus class="size-4" />
								</Button>
							</div>
							{#if tags.length > 0}
								<div class="my-2 flex flex-wrap gap-1.5">
									{#each tags as tag (tag)}
										<Badge variant="outline" class="flex items-center gap-1.5 px-2.5 py-1">
											{tag}
											<button
												type="button"
												class="rounded-full hover:bg-muted"
												onclick={() => removeTag(tag)}
											>
												<X class="size-3" />
											</button>
										</Badge>
									{/each}
								</div>
							{/if}
							{#if errors.tags}
								<p class="text-xs text-destructive">{errors.tags}</p>
							{/if}
						</div>

						<div class="space-y-2 sm:col-span-2">
							<div class="flex flex-row justify-between">
								<Label for="slug">Meta Slug</Label>
							</div>
							<Input id="slug" bind:value={slug} aria-invalid={!!errors.slug} class="mb-2" />
						</div>

						<div class="space-y-2 sm:col-span-2">
							<div class="flex flex-row justify-between">
								<Label for="metaTitle">Meta Title</Label>
							</div>
							<Input
								id="metaTitle"
								bind:value={metaTitle}
								aria-invalid={!!errors.metaTitle}
								class="mb-2"
							/>
						</div>

						<div class="space-y-2 sm:col-span-2">
							<div class="flex flex-row justify-between">
								<Label for="metaDescription">Meta Description</Label>
							</div>
							<Textarea
								id="metaDescription"
								bind:value={metaDescription}
								aria-invalid={!!errors.metaDescription}
								rows={4}
								class="mb-2"
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<div class="space-y-6 lg:col-span-6">
			<!-- Homepage Display Options -->
			<Card>
				<CardHeader>
					<CardTitle>Homepage Display Options</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-col gap-4">
					<div class="space-y-2 sm:col-span-2">
						<Label for="status">Publishing Status<span class="text-destructive">*</span></Label>
						<Select.Root type="single" name="status" bind:value={status}>
							<Select.Trigger
								class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
							>
								{publishingTriggerContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each publishingOptions as s (s.value)}
										<Select.Item value={s.value} label={s.label}>
											{s.label}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
						{#if errors.status}
							<p class="text-xs text-destructive">{errors.status}</p>
						{/if}
					</div>

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

					<div class="flex items-center justify-between rounded-lg border p-3">
						<div class="space-y-0.5">
							<Label for="isFeatured">Featured</Label>
							<p class="text-xs text-muted-foreground">Featured in homepage (Max 8)</p>
						</div>
						<Switch id="isFeatured" bind:checked={isFeatured} />
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
	<div class="flex justify-end gap-3">
		<Button type="button" variant="outline" href="/website">Cancel</Button><Button
			type="submit"
			disabled={isSubmitting || isGenerating || generating}
			>{isSubmitting ? 'Saving?' : initial ? 'Update catalog item' : 'Create catalog item'}</Button
		>
	</div>
</form>
