<script lang="ts">
	import { format } from 'date-fns';
	let { dateOfTransfer }: { dateOfTransfer: string } = $props();
</script>

<div class="text-center font-medium text-foreground">
	{format(new Date(dateOfTransfer), 'dd/MM/yyyy')}
</div>
