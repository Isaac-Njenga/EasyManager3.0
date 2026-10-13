<script lang="ts">
	let {
		inventorySummary
	}: { inventorySummary: { totalItemsInStock: number; totalProducts: number } } = $props();
</script>

<div class="flex flex-col">
	<span class="font-medium text-foreground">
		Total Units: {inventorySummary.totalItemsInStock?.toLocaleString() ?? 0}
	</span>
	<span class="text-xs text-muted-foreground">
		Products: {inventorySummary.totalProducts ?? 0}
	</span>
</div>
