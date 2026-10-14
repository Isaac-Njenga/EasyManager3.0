<script lang="ts">
	let {
		assignedShop
	}: { assignedShop: { name: string; shopCode: string; address: { town: string } } } = $props();
</script>

{#if assignedShop}
	<div class="flex flex-col">
		<span class="text-xs font-medium">{assignedShop.name}</span>
		<span class="text-[11px] text-muted-foreground">
			{assignedShop.shopCode} ({assignedShop.address.town})
		</span>
	</div>
{:else}
	<span class="text-xs text-muted-foreground italic">Unassigned</span>
{/if}
