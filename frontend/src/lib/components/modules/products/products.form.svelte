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

<form onsubmit={handleSubmit} class="space-y-6">
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
						<Label for="name">Product Name</Label>

						<Input id="name" bind:value={name} placeholder="ARM CHAIR" required />
					</div>

					<div class="space-y-2">
						<Label for="sku">SKU</Label>

						<Input id="sku" bind:value={sku} placeholder="CF-001" required />
					</div>

					<div class="space-y-2">
						<Label for="sku">Code</Label>

						<Input id="sku" bind:value={code} placeholder="ARM-001" required />
					</div>

					<div class="space-y-2">
						<Label for="sku">Colour</Label>

						<Input id="sku" bind:value={colour} placeholder="Red" required />
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
						<Label for="category">Category</Label>
						<Input id="category" bind:value={category} placeholder="Office Chair" required />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Pricing & Inventory</CardTitle>
				</CardHeader>

				<CardContent class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-2">
						<Label for="costPrice">Cost Price</Label>

						<Input
							id="costPrice"
							type="number"
							min="0"
							step="0.01"
							bind:value={costPrice}
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="sellingPrice">Selling Price</Label>

						<Input
							id="sellingPrice"
							type="number"
							min="0"
							step="0.01"
							bind:value={sellingPrice}
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="quantity">Current Stock</Label>

						<Input id="quantity" type="number" min="0" step="1" bind:value={quantity} required />
					</div>

					<div class="space-y-2">
						<Label for="quantity">Location</Label>

						<Input id="quantity" type="text" bind:value={location} required />
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

						<RadioGroup.Root value="status" class="flex flex-col">
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="Active" id="active" />
								<Label for="Active">Active</Label>
							</div>
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="Inactive" id="inactive" />
								<Label for="Inactive">Inactive</Label>
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
