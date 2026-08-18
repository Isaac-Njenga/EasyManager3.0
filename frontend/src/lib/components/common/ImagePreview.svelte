<script lang="ts">
	import { Dialog, DialogContent, DialogTitle } from '$lib/components/ui/dialog';

	type Props = {
		src: string;
		alt?: string;
		class?: string;
	};

	let { src, alt = 'Image', class: className = '' }: Props = $props();

	let open = $state(false);
</script>

<button
	type="button"
	class={`group relative overflow-hidden rounded-md border bg-muted ${className}`}
	onclick={() => (open = true)}
	aria-label={`View ${alt}`}
>
	<img
		{src}
		{alt}
		class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
	/>
</button>

<Dialog bind:open>
	<DialogContent class="max-w-4xl p-2">
		<DialogTitle class="sr-only">
			{alt}
		</DialogTitle>

		<div class="flex max-h-[80vh] items-center justify-center">
			<img {src} {alt} class="max-h-[75vh] max-w-full rounded-md object-contain" />
		</div>
	</DialogContent>
</Dialog>
