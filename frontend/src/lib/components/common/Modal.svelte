<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	type Props = {
		open?: boolean;
		title?: string;
		description?: string;
		children?: Snippet;
		footer?: Snippet;
	};

	let { open = $bindable(false), title, description, children, footer }: Props = $props();
</script>

<Dialog.Root bind:open
	><Dialog.Content class="flex max-h-[95vh] flex-col sm:max-w-200">
		{#if title || description}
			<Dialog.Header>
				{#if title}<Dialog.Title>{title}</Dialog.Title>{/if}
				{#if description}<Dialog.Description>{description}</Dialog.Description>{/if}
			</Dialog.Header>
		{/if}
		<div class="no-scrollbar overflow-y-auto px-4">
			{@render children?.()}
		</div>

		{#if footer}
			<Dialog.Footer>
				{@render footer()}
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
