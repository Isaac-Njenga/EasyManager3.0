<script lang="ts">
	import { formatCurrency } from '$lib/utils';

	let { amount }: { amount: number } = $props();
</script>

<div class="text-center">
	<p class="text-md text-red-500">{formatCurrency(amount)}</p>
</div>
