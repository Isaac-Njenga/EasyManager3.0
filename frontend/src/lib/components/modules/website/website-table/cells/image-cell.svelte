<script lang="ts">
	import Package from '@lucide/svelte/icons/package';

	let { image, name }: { image: string[]; name: string } = $props();
</script>

{#if image && image.length > 0}
	<img src={image[0]} alt={name} class="size-12 rounded-xs object-cover" />
{:else}
	<div class="flex size-12 items-center justify-center rounded-md border bg-muted">
		<span class="text-xs text-muted-foreground"><Package class="size-5" /></span>
	</div>
{/if}
