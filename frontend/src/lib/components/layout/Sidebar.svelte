<script lang="ts">
	import { resolve } from '$app/paths';
	import { appConfig } from '$lib/config/app';
	import { navigation } from '$lib/config/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
</script>

<aside class="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background md:flex md:flex-col">
	<div class="flex h-16 items-center px-6">
		<div
			class="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
		>
			<span class="font-bold">S</span>
		</div>

		<div class="font-semibold tracking-tight">
			{appConfig.name}
		</div>
	</div>

	<Separator />

	<nav class="flex-1 space-y-1 p-4">
		{#each navigation as item (item.href)}
			<a
				href={resolve(item.href)}
				class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			>
				<item.icon size={18} strokeWidth={1.8} />

				<span>{item.title}</span>
			</a>
		{/each}
	</nav>

	<div class="border-t p-4">
		<Button variant="outline" class="w-full">Sign out</Button>
	</div>
</aside>
