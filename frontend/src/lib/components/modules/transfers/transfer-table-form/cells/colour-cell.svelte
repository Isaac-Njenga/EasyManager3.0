<script lang="ts">
	let { colour }: { colour: string } = $props();
</script>

<div class="w-full">
	<p class="text-xs text-center uppercase">{colour ?? ''}</p>
</div>
