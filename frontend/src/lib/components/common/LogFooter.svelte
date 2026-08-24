<script lang="ts">
	import { format } from 'date-fns';

	type Props = { createTimestamp: string; updateTimestamp: string };

	let { createTimestamp, updateTimestamp }: Props = $props();
</script>

<div class="space-y-1 rounded-lg border bg-muted/40 p-3 text-[11px] text-muted-foreground">
	<div class="flex-end flex gap-1">
		<span>Created:</span>
		<span>{format(new Date(createTimestamp), 'PPPPp')}</span>
	</div>
	<div class="flex-end flex gap-1">
		<span>Last Updated:</span>
		<span>{format(new Date(updateTimestamp), 'PPPPp')}</span>
	</div>
</div>
