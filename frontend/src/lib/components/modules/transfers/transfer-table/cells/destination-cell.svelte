<script lang="ts">
	let { destination }: { destination: { locationId: string } } = $props();
</script>

<div class="w-full">
	<div class="truncate font-medium text-foreground">
		{destination.locationId ?? ''}
	</div>
</div>
