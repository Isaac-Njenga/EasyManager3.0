<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { status }: { status: string } = $props();
</script>

{#if status === 'Active'}
	<Badge
		variant="outline"
		class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
	>
		Active
	</Badge>
{:else}
	<Badge
		variant="outline"
		class="border-zinc-500/30 bg-zinc-500/10 text-zinc-500 dark:text-zinc-400"
	>
		{status ?? 'Inactive'}
	</Badge>
{/if}
