<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';

	let {
		value = '',
		onChange
	}: {
		value?: string;
		onChange?: (value: string) => void;
	} = $props();

	let isLoading = $state(false);

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		onChange?.(input.value);
	}
</script>

<InputGroup.Root>
	<InputGroup.Input placeholder="Search..." oninput={handleInput} {value} />
	<InputGroup.Addon>
		<SearchIcon />
	</InputGroup.Addon>
</InputGroup.Root>
