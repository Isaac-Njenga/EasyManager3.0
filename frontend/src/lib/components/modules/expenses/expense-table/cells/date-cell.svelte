<script lang="ts">
	import { format } from 'date-fns';

	let { dateOfExpense }: { dateOfExpense: string } = $props();
</script>

<div class="text-center">
	<p class="text-xs">{format(new Date(dateOfExpense), 'EE dd, MMM yyyy')}</p>
</div>
