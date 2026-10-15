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
			After transfer: {currentQuantity + quantityToTransfer}
		</p>
		{#if !hasDestinationItem && quantityToTransfer > 0}
			<p class="text-center text-[10px] text-muted-foreground">
				Will be added to destination inventory
			</p>
		{/if}
	{:else}
		<p class="text-xs text-muted-foreground">Current: -</p>
		<p class="text-xs text-muted-foreground">After: -</p>
	{/if}
</div>
