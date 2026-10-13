<script lang="ts">
	let { type }: { type: string } = $props();
</script>

{#if type === 'inter_warehouse'}
	<div class="truncate font-medium text-orange-400">Warehouse-Warehouse</div>
{:else if type === 'return_to_hub'}
	<div class="truncate font-medium text-blue-400">Shop-Warehouse</div>
{:else if type === 'store_replenishment'}
	<div class="truncate font-medium text-zinc-400">Warehouse-Shop</div>
{:else}
	<div class="truncate font-medium text-yellow-400">Shop-Shop</div>
{/if}
