<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import HomeIcon from '@lucide/svelte/icons/house';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

	let { error, status } = $props();

	const isNotFound = $derived(status === 404);
	const title = $derived(isNotFound ? 'Page not found' : 'Something went wrong');
	const description = $derived(
		isNotFound
			? "The page you're looking for may have moved, been removed, or never existed."
			: 'We could not complete that request. Please try again or return to your dashboard.'
	);
	const errorMessage = $derived(
		!isNotFound && error?.message && error.message !== 'Internal Error' ? error.message : ''
	);

	function goBack() {
		if (browser) window.history.back();
	}

	function retry() {
		if (browser) window.location.reload();
	}
</script>

<svelte:head>
	<title>{status} | EasyManager</title>
	<meta name="description" content={description} />
</svelte:head>

<main
	class="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16"
>
	<div
		class="pointer-events-none absolute inset-0 -z-10 opacity-70 dark:opacity-40"
		aria-hidden="true"
	>
		<div class="absolute top-1/4 -left-24 size-72 rounded-full bg-primary/10 blur-3xl"></div>
		<div class="absolute -right-24 bottom-1/4 size-72 rounded-full bg-amber-500/10 blur-3xl"></div>
	</div>

	<div class="w-full max-w-xl text-center">
		<div
			class="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm"
		>
			{#if isNotFound}
				<HomeIcon class="size-7" aria-hidden="true" />
			{:else}
				<TriangleAlertIcon class="size-7" aria-hidden="true" />
			{/if}
		</div>

		<p class="mb-3 text-sm font-semibold tracking-[0.2em] text-primary uppercase">Error {status}</p>
		<h1 class="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
		<p class="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground">{description}</p>

		{#if errorMessage}
			<p
				class="mx-auto mt-4 max-w-lg rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
			>
				{errorMessage}
			</p>
		{/if}

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<Button href="/" size="lg">
				<HomeIcon class="size-4" aria-hidden="true" />
				Go to dashboard
			</Button>
			<Button variant="outline" size="lg" onclick={isNotFound ? goBack : retry}>
				{#if isNotFound}
					<ArrowLeftIcon class="size-4" aria-hidden="true" />
					Go back
				{:else}
					<RefreshCwIcon class="size-4" aria-hidden="true" />
					Try again
				{/if}
			</Button>
		</div>
	</div>
</main>
