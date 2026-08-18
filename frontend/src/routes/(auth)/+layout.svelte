<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Sign In | EasyManager</title>
	<meta
		name="description"
		content="Sign in to EasyManeger."
	/>
</svelte:head>

<div class="min-h-screen bg-muted/30">
	{@render children()}
</div>