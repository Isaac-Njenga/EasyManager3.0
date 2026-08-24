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
		SidebarTrigger,
		useSidebar
	} from '$lib/components/ui/sidebar';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import LogOut from '@lucide/svelte/icons/log-out';
	import { toggleMode } from 'mode-watcher';
	import User from '@lucide/svelte/icons/user';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

	const { toggle } = useSidebar();
</script>

<Sidebar collapsible="icon">
	<!-- Header -->
	<SidebarHeader>
		<div class="flex h-8 items-center gap-3">
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
	<SidebarFooter class="px-2">
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger>
						{#snippet child({ props })}
							<SidebarMenuButton
								{...props}
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								tooltipContent="Account & Settings"
							>
								<div
									class="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"
								>
									<User class="size-4" />
								</div>
								<div class="grid flex-1 text-left text-xs leading-tight">
									<span class="truncate font-semibold">User Account</span>
									<span class="truncate text-[10px] text-muted-foreground"
										>Preferences & Actions</span
									>
								</div>
								<ChevronsUpDown class="ml-auto size-4 text-muted-foreground" />
							</SidebarMenuButton>
						{/snippet}
					</DropdownMenuTrigger>

					<DropdownMenuContent
						side="top"
						align="start"
						class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
						><!-- Sidebar Collapse Toggle -->
						<DropdownMenuItem class="cursor-pointer gap-2" onclick={toggle}>
							<SidebarTrigger class="pointer-events-none size-4" />
							<span>Toggle Sidebar</span>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<!-- Theme Toggle -->
						<DropdownMenuItem class="cursor-pointer gap-2" onclick={toggleMode}>
							<div class="relative flex size-4 shrink-0 items-center justify-center">
								<SunIcon
									class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
								/>
								<MoonIcon
									class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
								/>
							</div>
							<span>Toggle Theme</span>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<!-- Sign Out -->
						<DropdownMenuItem
							class="cursor-pointer gap-2 text-destructive focus:text-destructive"
							// onclick={handleSignOut}
						>
							<LogOut class="size-4" />
							<span>Sign Out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</Sidebar>
