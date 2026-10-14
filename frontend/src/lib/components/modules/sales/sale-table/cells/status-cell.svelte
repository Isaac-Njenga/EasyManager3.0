<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { paymentStatus }: { paymentStatus: string } = $props();
</script>

<div class="item-start flex flex-col gap-2">
	<div>
		{#if paymentStatus === 'Paid'}
			<Badge
				variant="outline"
				class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
			>
				Paid
			</Badge>
		{:else if paymentStatus === 'Pending'}
			<Badge
				variant="outline"
				class="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
			>
				Pending
			</Badge>
		{:else}
			<Badge variant="outline" class="border-green-200/30 bg-green-200/10 text-green-200">
				{paymentStatus}
			</Badge>
		{/if}
	</div>
</div>
