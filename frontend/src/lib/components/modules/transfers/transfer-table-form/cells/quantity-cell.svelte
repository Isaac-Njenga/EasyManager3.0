<script lang="ts">
	let { totalQuantity }: { totalQuantity: number } = $props();
</script>

<div class="flex flex-col items-center">
	<p class="text-xs {totalQuantity <= 0 ? 'text-destructive' : 'text-foreground'}">
		Source: {totalQuantity ?? 0}
	</p>
</div>
