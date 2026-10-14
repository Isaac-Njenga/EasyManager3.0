<script lang="ts">
	import { formatCurrency } from '$lib/utils';

	let { performanceSummary }: { performanceSummary: { totalCommissionEarned: number } } = $props();
</script>

<span class="text-destructive">
	{formatCurrency(Number(performanceSummary?.totalCommissionEarned ?? 0))}
</span>
