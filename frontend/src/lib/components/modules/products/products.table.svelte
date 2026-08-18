<script lang="ts">
	import type { Product } from '$lib/types/product.types';

	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';

	import { Badge } from '$lib/components/ui/badge';
	import ImagePreview from '$lib/components/common/ImagePreview.svelte';

	type Props = {
		products: Product[];
	};

	let { products }: Props = $props();

	function formatCurrency(value: number) {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES'
		}).format(value);
	}
</script>

<div class="rounded-lg border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Img</TableHead>
				<TableHead>Product</TableHead>
				<TableHead>Code</TableHead>
				<TableHead>SKU</TableHead>
				<TableHead>Category</TableHead>
				<TableHead>Price</TableHead>
				<TableHead>Stock Qty</TableHead>
				<TableHead>Status</TableHead>
				<TableHead class="w-[50px]"></TableHead>
			</TableRow>
		</TableHeader>

		<TableBody>
			{#each products as product (product._id)}
				<TableRow>
					<TableCell>
						<div>
							{#if product.image.length > 0}
								<ImagePreview src={product.image[0]} alt={product.name} class="size-16" />
							{:else}
								<div class="flex size-12 items-center justify-center rounded-md border bg-muted">
									<span class="text-xs text-muted-foreground">No image</span>
								</div>
							{/if}
						</div>
					</TableCell>

					<TableCell>
						<div>
							<div class="font-medium">
								{product.name}
							</div>

							{#if product.description}
								<div class="text-xs text-muted-foreground">
									{product.description}
								</div>
							{/if}
						</div>
					</TableCell>

					<TableCell class="font-mono text-xs">
						{product.code}
					</TableCell>

					<TableCell class="font-mono text-xs">
						{product.sku}
					</TableCell>

					<TableCell>
						{product.category}
					</TableCell>

					<TableCell>
						{formatCurrency(product.price)}
					</TableCell>

					<TableCell>
						<div class="font-medium">
							{product.quantity}
						</div>

						{#if product.quantity <= 10}
							<div class="text-xs text-destructive">Low stock</div>
						{/if}
					</TableCell>

					<TableCell>
						{#if product.status === 'ACTIVE'}
							<Badge>Active</Badge>
						{:else}
							<Badge variant="secondary">Inactive</Badge>
						{/if}
					</TableCell>

					<TableCell>
						<!-- Actions will go here -->
					</TableCell>
				</TableRow>
			{:else}
				<TableRow>
					<TableCell colspan={8} class="h-24 text-center">No products found.</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
