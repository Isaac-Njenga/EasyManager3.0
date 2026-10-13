<script lang="ts">
	let { name, address }: { name: string; address: { building?: string } } = $props();
</script>

<div class="w-full">
	<div class="truncate font-medium text-foreground">{name}</div>
	{#if address.building}
		<div class="truncate text-xs text-muted-foreground">
			{address.building}
		</div>
	{/if}
</div>
