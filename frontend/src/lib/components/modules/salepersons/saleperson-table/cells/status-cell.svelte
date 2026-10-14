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
{:else if status === 'Inactive'}
	<Badge
		variant="outline"
		class="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
	>
		Inactive
	</Badge>
{:else}
	<Badge
		variant="outline"
		class="border-destructive/30 bg-destructive/10 text-destructive dark:text-rose-400"
	>
		Terminated
	</Badge>
{/if}
