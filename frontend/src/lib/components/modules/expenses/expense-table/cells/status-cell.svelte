<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { paymentStatus }: { paymentStatus: string } = $props();
</script>

{#if paymentStatus === 'Paid'}
	<Badge
		variant="outline"
		class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
	>
		Paid
	</Badge>
{:else if paymentStatus === 'Cancelled'}
	<Badge
		variant="outline"
		class="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
	>
		Cancelled
	</Badge>
{:else}
	<Badge
		variant="outline"
		class="border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400"
	>
		{paymentStatus}
	</Badge>
{/if}
