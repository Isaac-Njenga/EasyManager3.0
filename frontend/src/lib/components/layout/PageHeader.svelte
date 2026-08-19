<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	type Props = {
		title: string;
		description?: string;
		actionLabel?: string;
		actionHref?: string;
	};

	let { title, description, actionLabel, actionHref }: Props = $props();
</script>

<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<div class="space-y-1">
		<h1 class="text-2xl font-semibold tracking-tight">
			{title}
		</h1>

		{#if description}
			<p class="text-sm text-muted-foreground">
				{description}
			</p>
		{/if}
	</div>

	{#if actionLabel && actionHref}
		<Button href={actionHref}>
			{actionLabel}
		</Button>
	{/if}
</div>
