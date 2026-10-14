<script lang="ts">
	import { formatCurrency } from '$lib/utils';

	let { grandTotal }: { grandTotal: number } = $props();
</script>

<div class="w-full">
	<p class="font-normal text-green-400">
		{formatCurrency(grandTotal)}
	</p>
</div>
