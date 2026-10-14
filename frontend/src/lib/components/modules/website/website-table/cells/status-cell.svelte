<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { inStock }: { inStock: boolean } = $props();
</script>

{#if inStock}
	<Badge variant="outline" class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
		In Stock
	</Badge>
{:else}
	<Badge variant="outline" class="border-destructive/30 bg-destructive/10 text-destructive">
		Out of Stock
	</Badge>
{/if}
