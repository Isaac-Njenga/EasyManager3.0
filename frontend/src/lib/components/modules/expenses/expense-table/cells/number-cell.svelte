<script lang="ts">
	let { expenseNumber }: { expenseNumber: string } = $props();
</script>

<div class="flex flex-col items-center">
	<p class="text-xs font-semibold">{expenseNumber}</p>
</div>
