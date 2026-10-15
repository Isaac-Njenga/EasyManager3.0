<script lang="ts">
	type Props = {
		destinationSelected: boolean;
		hasDestinationItem: boolean;
		currentQuantity: number;
		quantityToTransfer: number;
	};

	let { destinationSelected, hasDestinationItem, currentQuantity, quantityToTransfer }: Props =
		$props();
</script>

<div class="flex flex-col items-center">
	{#if destinationSelected}
		<p class="text-xs text-muted-foreground">
			Current: {hasDestinationItem ? currentQuantity : 'Not stocked'}
		</p>
		<p class="text-xs font-medium text-green-700 dark:text-green-400">
			After: {currentQuantity + quantityToTransfer}
		</p>
	{:else}
		<p class="text-xs text-muted-foreground">Current: -</p>
		<p class="text-xs text-muted-foreground">After: -</p>
	{/if}
</div>
