<script lang="ts">
	import type { Sale } from '$lib/services/sales/sales.types';

	// 1. Correctly type the props using your existing Sale type
	let { items }: { items: Sale['items'] } = $props();

	function getProductName(item: Sale['items'][number]): string {
		if (item && item.product && typeof item.product === 'object') {
			return (item.product as { name: string }).name; // Type cast if necessary
		}
		return 'Product unavailable';
	}
</script>

<div class="w-full space-y-0.5">
	{#if items && items.length > 0}
		<div class="truncate text-xs font-medium uppercase">
			{getProductName(items[0])}
		</div>

		{#if items.length > 1}
			<p class="text-[11px] text-muted-foreground">
				+ {items.length - 1} more item{items.length - 1 > 1 ? 's' : ''}
			</p>
		{:else}
			<p class="text-[11px] text-muted-foreground">
				Qty: {items[0].quantity}
			</p>
		{/if}
	{:else}
		<span class="text-xs text-muted-foreground">No items</span>
	{/if}
</div>
