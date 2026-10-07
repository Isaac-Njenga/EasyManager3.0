<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { cn } from '$lib/utils';

	type Props = {
		open?: boolean;
		title?: string;
		description?: string;
		contentClass?: string;
		children?: Snippet;
		footer?: Snippet;
	};

	let {
		open = $bindable(false),
		title,
		description,
		contentClass,
		children,
		footer
	}: Props = $props();
</script>

<Dialog.Root bind:open
	><Dialog.Content class={cn('flex max-h-[95vh] flex-col sm:max-w-220', contentClass)}>
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
