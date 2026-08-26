<script lang="ts">
	import { SidebarProvider } from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/layout/AppSidebar.svelte';
	// import Header from '$lib/components/layout/Header.svelte';

	let { children } = $props();
</script>

<SidebarProvider>
	<AppSidebar />

	<div class="flex min-h-screen w-full flex-col">
		<!-- <Header /> -->

		<main class="flex-1">
			<div class="mx-auto w-full max-w-[1600px] px-2 py-4 sm:px-3 lg:px-4">
				{@render children()}
			</div>
		</main>
	</div>
</SidebarProvider>
