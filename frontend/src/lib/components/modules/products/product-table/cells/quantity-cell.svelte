<script lang="ts">
	let { totalQuantity }: { totalQuantity: number } = $props();
</script>

<div class="flex flex-col items-center">
	<p class="text-xs">{totalQuantity ?? ''}</p>
	<!-- low stock alert -->
	{#if totalQuantity <= 5}
		<p class="text-xs text-amber-500">Low stock</p>
	{/if}
</div>
