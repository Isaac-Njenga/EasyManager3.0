<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let { value } = $props();

	// Define the configuration for the tweened store
	const count = tweened(0, {
		duration: 2000,
		easing: cubicOut
	});

	onMount(() => {
		// Animate to the target number once mounted
		count.set(value);
	});
</script>

<div>
	<p>{$count.toFixed(0)}</p>
</div>
