<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen bg-background">
	<Sidebar />

	<div class="md:pl-64">
		<Header />

		<main>
			<div class="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
				{@render children()}
			</div>
		</main>
	</div>
</div>
