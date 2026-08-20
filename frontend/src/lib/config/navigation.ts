import type { Component } from 'svelte';
import type { Pathname } from '$app/types';

import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
import Package from '@lucide/svelte/icons/package';
import Receipt from '@lucide/svelte/icons/receipt';
import ChartNoAxesCombined from '@lucide/svelte/icons/chart-no-axes-combined';
import Settings from '@lucide/svelte/icons/settings';

export type NavigationItem = {
	title: string;
	href: Pathname;
	icon: Component;
};

export type NavigationGroup = {
	label: string;
	items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
	{
		label: 'Overview',
		items: [
			{
				title: 'Dashboard',
				href: '/dashboard',
				icon: LayoutDashboard
			}
		]
	},
	{
		label: 'Commerce',
		items: [
			{
				title: 'Products',
				href: '/products',
				icon: Package
			},
			{
				title: 'Sales',
				href: '/sales',
				icon: ShoppingCart
			},

			{
				title: 'Expenses',
				href: '/expenses',
				icon: Receipt
			}
		]
	},
	{
		label: 'System',
		items: [
			{
				title: 'Reports',
				href: '/reports',
				icon: ChartNoAxesCombined
			},
			{
				title: 'Settings',
				href: '/settings',
				icon: Settings
			}
		]
	}
];
