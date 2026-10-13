<script lang="ts">
	let { totalItemsCount }: { totalItemsCount: string } = $props();
</script>

<div class="w-full">
	<div class="truncate text-center font-medium text-foreground">
		{totalItemsCount}
	</div>
</div>
