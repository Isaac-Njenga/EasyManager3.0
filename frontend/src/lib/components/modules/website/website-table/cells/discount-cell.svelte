<script lang="ts">import Badge from '$lib/components/ui/badge/badge.svelte';
	
	let { discount }: { discount: number } = $props();
</script>

{#if Number(discount) > 0}
	<Badge variant="secondary" class="font-mono text-xs">
		-{discount}%
	</Badge>
{:else}
	<span class="text-xs text-muted-foreground">—</span>
{/if}
