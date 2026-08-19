<script lang="ts">
	import type { Product } from '$lib/types/product.types';

	type Props = {
		selectedProduct: Product | null;
	};

	let { selectedProduct }: Props = $props();
</script>

{#if selectedProduct}
	<div class="space-y-4 py-2">
		<div>
			<p class="text-xs text-muted-foreground">Code</p>
			<p class="font-medium">{selectedProduct.code}</p>
		</div>
		<div>
			<p class="text-xs text-muted-foreground">Category</p>
			<p class="font-medium">{selectedProduct.category}</p>
		</div>
		<div>
			<p class="text-xs text-muted-foreground">Selling Price</p>
			<p class="font-medium">${selectedProduct.sellingPrice}</p>
		</div>
		<div>
			<p class="text-xs text-muted-foreground">Stock Quantity</p>
			<p class="font-medium">{selectedProduct.quantity}</p>
		</div>
		{#if selectedProduct.description}
			<div>
				<p class="text-xs text-muted-foreground">Description</p>
				<p class="text-sm">{selectedProduct.description}</p>
			</div>
		{/if}
	</div>
{/if}
