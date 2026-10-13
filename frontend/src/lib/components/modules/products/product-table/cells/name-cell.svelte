<script lang="ts">
	let { name, category }: { name: string; category: string } = $props();
</script>

<div class="w-full">
	<div class="truncate font-medium uppercase">{name}</div>

	{#if category}
		<div class="truncate text-xs text-muted-foreground">
			Category: {category}
		</div>
	{/if}
</div>
