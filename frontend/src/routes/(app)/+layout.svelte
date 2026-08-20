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
			<div class="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
				{@render children()}
			</div>
		</main>
	</div>
</SidebarProvider>
