<script lang="ts">
	import type { Product, ProductStatus } from '$lib/types/product.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ImageUpload from '$lib/components/common/ImageUpload.svelte';
	import { toast } from 'svelte-sonner';

	type Props = {
		product?: Product;
	};

	let { product }: Props = $props();

	let name = $state('');
	let sku = $state('');
	let code = $state('');
	let colour = $state('');
	let image = $state('');
	let description = $state('');
	let category = $state('');
	let costPrice = $state('');
	let sellingPrice = $state('');
	let quantity = $state('');
	let location = $state('');
	let status = $state<ProductStatus>('Active');

	// 1. Map required field keys to user-friendly labels
	const requiredFieldsConfig = [
		{ label: 'Product Name', getValue: () => name },
		{ label: 'SKU', getValue: () => sku },
		{ label: 'Code', getValue: () => code },
		{ label: 'Category', getValue: () => category },
		{ label: 'Cost Price', getValue: () => costPrice },
		{ label: 'Selling Price', getValue: () => sellingPrice },
		{ label: 'Current Stock', getValue: () => quantity },
		{ label: 'Location', getValue: () => location }
	];

	$effect(() => {
		name = product?.name ?? '';
		sku = product?.sku ?? '';
		code = product?.code ?? '';
		colour = product?.colour ?? '';
		// image = product?.image ?? '';
		description = product?.description ?? '';
		category = product?.category ?? '';
		costPrice = product?.costPrice?.toString() ?? '';
		sellingPrice = product?.sellingPrice?.toString() ?? '';
		quantity = product?.quantity?.toString() ?? '';
		location = product?.location?.toString() ?? '';
		status = product?.status ?? 'Active';
	});

	let isSubmitting = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const missingFields = requiredFieldsConfig
			.filter((field) => !field.getValue()?.toString().trim())
			.map((field) => field.label);

		if (missingFields.length > 0) {
			toast.error('Please fill in required fields', {
				description: `Missing: ${missingFields.join(', ')}`
			});
			return;
		}

		isSubmitting = true;

		const formData = {
			name,
			sku,
			code,
			colour,
			image,
			description,
			category,
			costPrice: Number(costPrice),
			sellingPrice: Number(sellingPrice),
			quantity: Number(quantity),
			location,
			status
		};

		console.log('Product form:', formData);

		toast.success('Product Saved!', {
			// description: 'Sunday, December 03, 2023 at 9:00 AM',
			// action: {
			// 	label: 'Undo',
			// 	onClick: () => console.info('Undo')
			// }
		});

		await new Promise((resolve) => setTimeout(resolve, 1000));

		isSubmitting = false;
	}
</script>

<form onsubmit={handleSubmit} novalidate class="space-y-6">
	<div class="flex flex-row justify-center gap-2">
		<div class="w-full space-y-6">
			<Card
				><CardHeader>
					<CardTitle>Product Images Upload</CardTitle>
				</CardHeader><ImageUpload /></Card
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
						<Label for="name">Product Name *</Label>
						<Input id="name" bind:value={name} placeholder="ARM CHAIR" />
					</div>

					<div class="space-y-2">
						<Label for="sku">SKU *</Label>
						<Input id="sku" bind:value={sku} placeholder="CF-001" />
					</div>

					<div class="space-y-2">
						<Label for="code">Code *</Label>
						<Input id="code" bind:value={code} placeholder="ARM-001" />
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
						<Label for="category">Category *</Label>
						<Input id="category" bind:value={category} placeholder="Office Chair" />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Pricing & Inventory</CardTitle>
				</CardHeader>

				<CardContent class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-2">
						<Label for="costPrice">Cost Price *</Label>
						<Input id="costPrice" type="number" min="0" step="0.01" bind:value={costPrice} />
					</div>

					<div class="space-y-2">
						<Label for="sellingPrice">Selling Price *</Label>
						<Input id="sellingPrice" type="number" min="0" step="0.01" bind:value={sellingPrice} />
					</div>

					<div class="space-y-2">
						<Label for="quantity">Current Stock *</Label>
						<Input id="quantity" type="number" min="0" step="1" bind:value={quantity} />
					</div>

					<div class="space-y-2">
						<Label for="location">Location *</Label>
						<Input id="location" type="text" bind:value={location} />
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
