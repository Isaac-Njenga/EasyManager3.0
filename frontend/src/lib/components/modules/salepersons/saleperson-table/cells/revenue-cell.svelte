<script lang="ts">
	import { formatCurrency } from '$lib/utils';

	let { performanceSummary }: { performanceSummary: { totalRevenueGenerated: number } } = $props();
</script>

<span class="text-destructive">
	{formatCurrency(Number(performanceSummary?.totalRevenueGenerated ?? 0))}
</span>
