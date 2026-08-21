<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import { appConfig } from '$lib/config/app';
	import { navigationGroups } from '$lib/config/navigation';

	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupContent,
		SidebarGroupLabel,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuItem,
		SidebarMenuButton,
		SidebarTrigger
	} from '$lib/components/ui/sidebar';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import LogOut from '@lucide/svelte/icons/log-out';
	import { toggleMode } from 'mode-watcher';
</script>

<Sidebar collapsible="icon">
	<!-- Header -->
	<SidebarHeader>
		<div class="flex h-8 items-center gap-3 ">
			<div
				class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
			>
				<span class="text-xs font-bold">EM</span>
			</div>

			<span class="truncate font-semibold group-data-[collapsible=icon]:hidden">
				{appConfig.name}
			</span>
		</div>
	</SidebarHeader>

	<Separator />

	<!-- Content with Grouped Navigation -->
	<SidebarContent>
		{#each navigationGroups as group (group.label)}
			<SidebarGroup>
				<SidebarGroupLabel>{group.label}</SidebarGroupLabel>

				<SidebarGroupContent>
					<SidebarMenu>
						{#each group.items as item (item.href)}
							{@const href = resolve(item.href)}
							{@const isActive =
								page.url.pathname === item.href || page.url.pathname.startsWith(`${item.href}/`)}

							<SidebarMenuItem>
								<SidebarMenuButton {isActive} tooltipContent={item.title}>
									{#snippet child({ props })}
										<a {href} {...props}>
											<item.icon class="size-4 shrink-0" />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</SidebarMenuButton>
							</SidebarMenuItem>
						{/each}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		{/each}
	</SidebarContent>

	<!-- Footer -->
	<SidebarFooter class="gap-2 px-2">
		<SidebarMenu>
			<!-- Toggle Collapse Trigger -->
			<SidebarMenuItem class="flex justify-start">
				<SidebarTrigger />
			</SidebarMenuItem>

			<!-- Sign Out Button -->

			<!-- Theme Toggle Button -->
			<SidebarMenuItem>
				<SidebarMenuButton onclick={toggleMode} tooltipContent="Toggle theme">
					<div class="relative flex size-4 shrink-0 items-center justify-center">
						<SunIcon
							class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
						/>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem><SidebarMenuItem>
				<SidebarMenuButton tooltipContent="Sign out">
					{#snippet child({ props })}
						<button type="button" {...props}>
							<LogOut class="size-4 shrink-0" />
							<span>Sign out</span>
						</button>
					{/snippet}
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</Sidebar>
