<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import ImageUpload from '$lib/components/common/ImageUpload.svelte';
	import { toast } from 'svelte-sonner';
	import { webProductService } from '$lib/services/website/website.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type {
		WebProduct,
		CatalogCategory,
		CreateWebProductInput,
		CreateDescriptionInput,
		GeneratedDescriptionResponse
	} from '$lib/services/website/website.types';
	type Props = {
		webProduct?: WebProduct;
		onSubmit: (input: CreateWebProductInput) => Promise<void> | void;
		onDescriptionSubmit: (
			input: CreateDescriptionInput
		) => Promise<GeneratedDescriptionResponse | undefined> | void;
		isSubmitting?: boolean;
		isGenerating?: boolean;
	};
	let {
		webProduct,
		onSubmit,
		onDescriptionSubmit,
		isSubmitting = false,
		isGenerating = false
	}: Props = $props();
	const initial = untrack(() => webProduct);
	let name = $state(initial?.name ?? '');
	let slug = $state(initial?.slug ?? '');
	let category = $state(
		typeof initial?.category === 'string' ? initial.category : (initial?.category?._id ?? '')
	);
	let images = $state<string[]>(initial?.images ? [...initial.images] : []);
	let description = $state(initial?.description ?? '');
	let basePrice = $state<number | undefined>(initial?.pricing.basePrice);
	let currency = $state(initial?.pricing.currency ?? 'KES');
	let compareAtPrice = $state<number | undefined>(initial?.pricing.compareAtPrice ?? undefined);
	let colours = $state(initial?.colours.join('\n') ?? '');
	let tags = $state(initial?.tags.join('\n') ?? '');
	let keyFeatures = $state(initial?.keyFeatures.join('\n') ?? '');
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
	let categories = $state<CatalogCategory[]>([]);
	let categoryError = $state('');
	let generating = $state(false);
	const lines = (text: string) => [
		...new Set(
			text
				.split('\n')
				.map((s) => s.trim())
				.filter(Boolean)
		)
	];
	onMount(async () => {
		try {
			categories = await webProductService.categories(getBrowserServiceContext());
			const current = initial?.category;
			if (current && typeof current !== 'string' && !categories.some((c) => c._id === current._id))
				categories = [...categories, current];
		} catch (error) {
			categoryError = error instanceof Error ? error.message : 'Could not load categories';
		}
	});
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
	async function generate() {
		if (generating || isGenerating) return;
		try {
			required();
			const input: CreateDescriptionInput = {
				name: name.trim(),
				category,
				pricing: { basePrice: basePrice!, currency: currency.trim() },
				colours: lines(colours),
				keyFeatures: lines(keyFeatures),
				specifications: readSpecifications()
			};
			generating = true;
			const result = await onDescriptionSubmit(input);
			if (result) {
				description = result.description;
				slug = result.slug;
				metaTitle = result.seo.metaTitle;
				metaDescription = result.seo.metaDescription;
				tags = [...new Set([...lines(tags), ...result.tags])].join('\n');
				keyFeatures = [...new Set([...lines(keyFeatures), ...result.keyFeatures])].join('\n');
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Generation failed');
		} finally {
			generating = false;
		}
	}
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
				colours: lines(colours),
				tags: lines(tags),
				keyFeatures: lines(keyFeatures),
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
	<fieldset
		disabled={isSubmitting || isGenerating || generating}
		class="grid gap-6 rounded-lg border p-6 md:grid-cols-2"
	>
		<legend class="px-2 font-semibold">Catalog item</legend>
		<div class="space-y-2">
			<Label for="name">Product name *</Label><Input id="name" required bind:value={name} />
		</div>
		<div class="space-y-2">
			<Label for="category">Category *</Label>
			<select
				id="category"
				required
				bind:value={category}
				class="w-full rounded-md border bg-background p-2"
			>
				<option value="" disabled>Select a category</option>
				{#each categories as entry (entry._id)}<option value={entry._id}>{entry.name}</option
					>{/each}
			</select>
			{#if categoryError}<p role="alert" class="text-sm text-destructive">{categoryError}</p>{/if}
		</div>
		<div class="space-y-2">
			<Label for="basePrice">Base price *</Label><Input
				id="basePrice"
				type="number"
				min="0"
				step="any"
				required
				bind:value={basePrice}
			/>
		</div>
		<div class="space-y-2">
			<Label for="currency">Currency *</Label><Input id="currency" required bind:value={currency} />
		</div>
		<div class="space-y-2">
			<Label for="compareAtPrice">Compare-at price</Label><Input
				id="compareAtPrice"
				type="number"
				min="0"
				step="any"
				bind:value={compareAtPrice}
			/>
		</div>
		<div class="space-y-2">
			<Label for="slug">Slug *</Label><Input id="slug" required bind:value={slug} />
		</div>
		<div class="space-y-2 md:col-span-2">
			<Label>Product images</Label><ImageUpload bind:selectedImages={images} />
		</div>
		<div class="space-y-2">
			<Label for="colours">Colours (one per line)</Label><Textarea
				id="colours"
				bind:value={colours}
			/>
		</div>
		<div class="space-y-2">
			<Label>Specifications</Label>
			{#each specifications as row, index}
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
		<div class="space-y-2 md:col-span-2">
			<Button
				type="button"
				variant="secondary"
				onclick={generate}
				disabled={!name.trim() ||
					!category ||
					basePrice === undefined ||
					basePrice < 0 ||
					!currency.trim()}>Generate content with AI</Button
			>
			<p class="text-sm text-muted-foreground">
				Enter a name, category, currency, and base price first. Add known colours, features, and
				specifications to guide generation. Review the generated content before saving.
			</p>
		</div>
		<div class="space-y-2 md:col-span-2">
			<Label for="description">Description</Label><Textarea
				id="description"
				rows={6}
				bind:value={description}
			/>
		</div>
		<div class="space-y-2">
			<Label for="keyFeatures">Key features (one per line)</Label><Textarea
				id="keyFeatures"
				rows={5}
				bind:value={keyFeatures}
			/>
		</div>
		<div class="space-y-2">
			<Label for="tags">Tags (one per line)</Label><Textarea id="tags" rows={5} bind:value={tags} />
		</div>
		<div class="space-y-2">
			<Label for="metaTitle">SEO title (70 characters)</Label><Input
				id="metaTitle"
				maxlength={70}
				bind:value={metaTitle}
			/>
		</div>
		<div class="space-y-2">
			<Label for="metaDescription">SEO description (320 characters)</Label><Textarea
				id="metaDescription"
				maxlength={320}
				bind:value={metaDescription}
			/>
		</div>
		<div class="space-y-2">
			<Label for="status">Publishing status</Label><select
				id="status"
				bind:value={status}
				class="w-full rounded-md border bg-background p-2"
				><option>DRAFT</option><option>PUBLISHED</option><option>ARCHIVED</option></select
			>
		</div>
		<div class="space-y-2">
			<Label for="sortOrder">Display sort order</Label><Input
				id="sortOrder"
				type="number"
				step="any"
				bind:value={sortOrder}
			/>
		</div>
		<div class="flex flex-wrap gap-4 md:col-span-2">
			<label class="flex items-center gap-2"
				><input type="checkbox" bind:checked={isFeatured} />Featured</label
			>
			<label class="flex items-center gap-2"
				><input type="checkbox" bind:checked={isBestSeller} />Best seller</label
			>
			<label class="flex items-center gap-2"
				><input type="checkbox" bind:checked={isNewArrival} />New arrival</label
			>
		</div>
	</fieldset>
	{#if isGenerating || generating}<p role="status">Generating catalog content?</p>{/if}
	<div class="flex justify-end gap-3">
		<Button type="button" variant="outline" href="/website">Cancel</Button><Button
			type="submit"
			disabled={isSubmitting || isGenerating || generating}
			>{isSubmitting ? 'Saving?' : initial ? 'Update catalog item' : 'Create catalog item'}</Button
		>
	</div>
</form>
