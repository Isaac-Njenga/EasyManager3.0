<script lang="ts">
	let { category, title }: { title: string; category: string } = $props();
</script>

<div class="w-full">
	<div class="truncate font-medium">{title}</div>
	<div class="truncate text-xs text-muted-foreground">
		{category}
	</div>
</div>
