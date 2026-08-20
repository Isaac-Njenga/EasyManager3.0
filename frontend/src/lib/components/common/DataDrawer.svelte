<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';

	type Props = {
		open?: boolean;
		title?: string;
		description?: string;
		direction?: 'left' | 'right' | 'top' | 'bottom';
		children?: Snippet;
		width?: string;
		footer?: Snippet;
	};

	let {
		open = $bindable(false),
		title,
		description,
		direction = 'right',
		width = 'w-[700px]',
		children,
		footer
	}: Props = $props();
</script>

<Drawer.Root {direction} bind:open modal={false}
	><Drawer.Content class={`h-full max-w-[90vw] ${width}`}>
		{#if title || description}
			<Drawer.Header>
				{#if title}<Drawer.Title>{title}</Drawer.Title>{/if}
				{#if description}<Drawer.Description>{description}</Drawer.Description>{/if}
			</Drawer.Header>
		{/if}

		<div class="no-scrollbar overflow-y-auto px-4">
			{@render children?.()}
		</div>

		{#if footer}
			<Drawer.Footer>
				{@render footer()}
			</Drawer.Footer>
		{/if}
	</Drawer.Content>
</Drawer.Root>
