<script lang="ts">
	let { source }: { source: { locationId: string } } = $props();
</script>

<div class="w-full">
	<div class="truncate font-medium text-foreground">
		{source.locationId ?? ''}
	</div>
</div>
