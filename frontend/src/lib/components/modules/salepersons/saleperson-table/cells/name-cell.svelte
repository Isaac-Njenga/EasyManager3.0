<script lang="ts">
	let { firstName, lastName, id }: { id: string; firstName: string; lastName: string } = $props();
	function getInitials(firstName: string, lastName: string): string {
		return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
	}
</script>

<div class="flex items-center gap-3">
	<div
		class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
	>
		{getInitials(firstName, lastName)}
	</div>
	<div class="flex flex-col">
		<span class="leading-none font-medium">
			{firstName}
			{lastName}
		</span>
		<span class="mt-1 text-xs text-muted-foreground">
			ID: {id.slice(-6)}
		</span>
	</div>
</div>
