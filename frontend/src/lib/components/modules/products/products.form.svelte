<script lang="ts">
	import type {
		Product,
		ProductStatus,
		CreateProductInput
	} from '$lib/services/product/product.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ImageUpload from '$lib/components/common/ImageUpload.svelte';

	type Props = {
		product?: Product;
		onSubmit: (payload: CreateProductInput) => Promise<void> | void;
		isSubmitting?: boolean;
	};

	let { product, onSubmit, isSubmitting = false }: Props = $props();

	let name = $state('');
	let sku = $state('');
	let code = $state('');
	let colour = $state('');
	let image = $state<string[]>([]);
	let description = $state('');
	let category = $state('');
	let costPrice = $state('');
	let sellingPrice = $state('');
	let status = $state<ProductStatus>('Active');

	let errors = $state<Record<string, string>>({});

	$effect(() => {
		name = product?.name ?? '';
		sku = product?.sku ?? '';
		code = product?.code ?? '';
		colour = product?.colour ?? '';
		image = product?.image ?? [];
		description = product?.description ?? '';
		category = product?.category ?? '';
		costPrice = product?.costPrice?.toString() ?? '';
		sellingPrice = product?.sellingPrice?.toString() ?? '';
		status = product?.status ?? 'Active';
	});

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) newErrors.name = 'Product name is required';
		if (!code.trim()) newErrors.code = 'Product code is required';
		if (!category.trim()) newErrors.category = 'Category is required';
		if (!costPrice) newErrors.costPrice = 'Cost price is required';
		if (!sellingPrice) newErrors.sellingPrice = 'Selling price is required';

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!validate()) return;

		const payload: CreateProductInput = {
			name: name.trim(),
			sku: sku.trim() || undefined,
			code: code.trim(),
			colour: colour.trim() || undefined,
			image: [...image],
			description: description.trim() || undefined,
			category: category.trim(),
			costPrice: Number(costPrice),
			sellingPrice: Number(sellingPrice),
			status: status
		};

		await onSubmit(payload);
	}
</script>

<form onsubmit={handleFormSubmit} novalidate class="space-y-6">
	<div class="flex flex-row justify-center gap-2">
		<div class="w-full space-y-6">
			<Card
				><CardHeader>
					<CardTitle>Product Images Upload</CardTitle>
				</CardHeader><ImageUpload bind:selectedImages={image} /></Card
			>
		</div>

		<Separator orientation="vertical" />

		<div class="w-full space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Product Information</CardTitle>
				</CardHeader>

				<CardContent class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-2">
						<Label for="name">Product Name <span class="text-destructive">*</span></Label>
						<Input
							id="name"
							bind:value={name}
							required
							aria-invalid={!!errors.name}
						/>{#if errors.name}
							<p class="text-xs text-destructive">{errors.name}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="sku">SKU/Batch Number</Label>
						<Input id="sku" bind:value={sku} />
					</div>

					<div class="space-y-2">
						<Label for="code">Code <span class="text-destructive">*</span></Label>
						<Input
							id="code"
							bind:value={code}
							required
							aria-invalid={!!errors.code}
						/>{#if errors.code}
							<p class="text-xs text-destructive">{errors.code}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="colour">Colour</Label>
						<Input id="colour" bind:value={colour} placeholder="Red" />
					</div>

					<div class="space-y-2 sm:col-span-2">
						<Label for="description">Description</Label>
						<Textarea
							id="description"
							bind:value={description}
							placeholder="Describe the product..."
							rows={4}
						/>
					</div>

					<div class="space-y-2 sm:col-span-2">
						<Label for="category">Category <span class="text-destructive">*</span></Label>
						<Input
							id="category"
							bind:value={category}
							placeholder="Office Chair"
							required
							aria-invalid={!!errors.category}
						/>
						{#if errors.category}
							<p class="text-xs text-destructive">{errors.category}</p>
						{/if}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Pricing & Inventory</CardTitle>
				</CardHeader>

				<CardContent class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-2">
						<Label for="costPrice">Cost Price <span class="text-destructive">*</span></Label>
						<Input
							id="costPrice"
							type="number"
							min="0"
							step="0.01"
							bind:value={costPrice}
							required
							aria-invalid={!!errors.costPrice}
						/>
						{#if errors.costPrice}
							<p class="text-xs text-destructive">{errors.costPrice}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="sellingPrice">Selling Price <span class="text-destructive">*</span></Label>
						<Input
							id="sellingPrice"
							type="number"
							min="0"
							step="0.01"
							bind:value={sellingPrice}
							required
							aria-invalid={!!errors.sellingPrice}
						/>
						{#if errors.sellingPrice}
							<p class="text-xs text-destructive">{errors.sellingPrice}</p>
						{/if}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Status</CardTitle>
				</CardHeader>

				<CardContent>
					<div class="space-y-2">
						<Label for="status">Product Status</Label>
						<RadioGroup.Root bind:value={status} class="flex flex-col">
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="Active" id="active" />
								<Label for="active">Active</Label>
							</div>
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="Inactive" id="inactive" />
								<Label for="inactive">Inactive</Label>
							</div>
						</RadioGroup.Root>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>

	<Separator />

	<div class="flex justify-center gap-3">
		<Button type="button" variant="outline" href="/products" size="lg">Cancel</Button>

		<Button type="submit" disabled={isSubmitting} size="lg">
			{isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
		</Button>
	</div>
</form>
