<script lang="ts">
	let { customer }: { customer: { name: string; phone: string } } = $props();
</script>

<div class="w-full">
	<p class="truncate text-xs font-medium">{customer?.name ?? 'N/A'}</p>
	{#if customer?.phone}
		<p class="text-[11px] text-muted-foreground">{customer.phone}</p>
	{/if}
</div>
