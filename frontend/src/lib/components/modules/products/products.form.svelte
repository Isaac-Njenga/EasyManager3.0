<script lang="ts">
	import type { Product, ProductStatus } from '$lib/types/product.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';

	type Props = {
		product?: Product;
	};

	let { product }: Props = $props();

	let name = $state('');
	let sku = $state('');
	let description = $state('');
	let category = $state('');
	let costPrice = $state('');
	let sellingPrice = $state('');
	let quantity = $state('');
	let reorderLevel = $state('');
	let status = $state<ProductStatus>('Active');

	$effect(() => {
		name = product?.name ?? '';
		sku = product?.sku ?? '';
		description = product?.description ?? '';
		category = product?.category ?? '';
		sellingPrice = product?.price?.toString() ?? '';
		quantity = product?.quantity?.toString() ?? '';
		status = product?.status ?? 'Active';
	});

	let isSubmitting = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		isSubmitting = true;

		const formData = {
			name,
			sku,
			description,
			category,
			costPrice: Number(costPrice),
			sellingPrice: Number(sellingPrice),
			quantity: Number(quantity),
			reorderLevel: Number(reorderLevel),
			status
		};

		console.log('Product form:', formData);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		isSubmitting = false;
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<Card>
		<CardHeader>
			<CardTitle>Basic Information</CardTitle>
		</CardHeader>

		<CardContent class="grid gap-6 sm:grid-cols-2">
			<div class="space-y-2">
				<Label for="name">Product Name</Label>

				<Input id="name" bind:value={name} placeholder="e.g. Premium Cement 50kg" required />
			</div>

			<div class="space-y-2">
				<Label for="sku">SKU</Label>

				<Input id="sku" bind:value={sku} placeholder="e.g. CEM-001" required />
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

				<Input id="category" bind:value={category} placeholder="e.g. Building Materials" required />
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

				<Input id="costPrice" type="number" min="0" step="0.01" bind:value={costPrice} required />
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
				<Label for="reorderLevel">Reorder Level</Label>

				<Input
					id="reorderLevel"
					type="number"
					min="0"
					step="1"
					bind:value={reorderLevel}
					required
				/>
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

				<select
					id="status"
					bind:value={status}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:outline-none"
				>
					<option value="ACTIVE">Active</option>
					<option value="INACTIVE">Inactive</option>
				</select>
			</div>
		</CardContent>
	</Card>

	<div class="flex justify-end gap-3">
		<Button type="button" variant="outline" href="/products">Cancel</Button>

		<Button type="submit" disabled={isSubmitting}>
			{isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
		</Button>
	</div>
</form>
