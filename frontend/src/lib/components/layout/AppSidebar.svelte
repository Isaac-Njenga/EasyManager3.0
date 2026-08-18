<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state'; //gives us access to the current SvelteKit page state.

	import { appConfig } from '$lib/config/app';
	import { navigation } from '$lib/config/navigation';

	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupContent,
		SidebarGroupLabel,
		SidebarHeader,
		SidebarMenu,
		// SidebarMenuButton,
		SidebarMenuItem
	} from '$lib/components/ui/sidebar';

	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import LogOut from '@lucide/svelte/icons/log-out';
</script>

<Sidebar collapsible="icon">
	<SidebarHeader>
		<div class="flex h-10 items-center gap-3 px-2">
			<div
				class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
			>
				<span class="text-sm font-bold">S</span>
			</div>

			<span class="truncate font-semibold">
				{appConfig.name}
			</span>
		</div>
	</SidebarHeader>

	<Separator />

	<SidebarContent>
		<SidebarGroup>
			<SidebarGroupLabel>Management</SidebarGroupLabel>

			<SidebarGroupContent>
				<SidebarMenu>
					{#each navigation as item (item.href)}
						{@const href = resolve(item.href)}

						{@const isActive =
							page.url.pathname === item.href || page.url.pathname.startsWith(`${item.href}/`)}

						<SidebarMenuItem>
							<a
								{href}
								class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
								class:!bg-accent={isActive}
								class:text-accent-foreground={isActive}
								class:font-semibold={isActive}
								aria-current={isActive ? 'page' : undefined}
							>
								<item.icon />

								<span>{item.title}</span>
							</a>
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	</SidebarContent>

	<SidebarFooter>
		<Button variant="ghost" class="w-full justify-start gap-2">
			<LogOut />

			<span class="group-data-[collapsible=icon]:hidden"> Sign out </span>
		</Button>
	</SidebarFooter>
</Sidebar>
