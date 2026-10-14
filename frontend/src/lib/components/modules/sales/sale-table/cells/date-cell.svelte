<script lang="ts">
	import { format } from 'date-fns';

	let { dateOfSale }: { dateOfSale: string } = $props();
</script>

<div class="w-full">
	<p class="font-normal">{format(new Date(dateOfSale), 'dd/MM/yyyy')}</p>
</div>
