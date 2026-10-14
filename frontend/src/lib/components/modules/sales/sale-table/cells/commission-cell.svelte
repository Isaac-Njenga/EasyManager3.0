<script lang="ts">
	import { formatCurrency } from '$lib/utils';

	let { commission }: { commission: number } = $props();
</script>

<div class="w-full">
	<p class="font-normal text-rose-400">
		{formatCurrency(commission)}
	</p>
</div>
