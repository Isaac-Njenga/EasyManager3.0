<script lang="ts">
	let {
		receiptNumber,
		saleperson
	}: { receiptNumber: string; saleperson: { firstName: string; lastName: string } } = $props();
</script>

<div class="w-full">
	<span class="font-semibold text-foreground">{receiptNumber}</span>
	<p class="text-xs text-muted-foreground">
		{saleperson.firstName}
		{saleperson.lastName}
	</p>
</div>
