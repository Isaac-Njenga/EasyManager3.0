import type { Component } from 'svelte';
import type { Pathname } from '$app/types';

import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
import Package from '@lucide/svelte/icons/package';
import Receipt from '@lucide/svelte/icons/receipt';
import ChartNoAxesCombined from '@lucide/svelte/icons/chart-no-axes-combined';
import Settings from '@lucide/svelte/icons/settings';
import Store from '@lucide/svelte/icons/store';
import Warehouse from '@lucide/svelte/icons/warehouse';
import ArrowRightLeft from '@lucide/svelte/icons/arrow-right-left';
import ClipboardClock from '@lucide/svelte/icons/clipboard-clock';
import Contact from '@lucide/svelte/icons/contact';
import Globe from '@lucide/svelte/icons/globe';
import ChartSpline from '@lucide/svelte/icons/chart-spline';
import Tag from '@lucide/svelte/icons/tag';

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
			// {
			// 	title: 'Test',
			// 	href: '/table-test',
			// 	icon: TestTubeDiagonal
			// }
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
			},
						// {
			// 	title: 'Customers',
			// 	href: '/customers',
			// 	icon: Globe
			// },
		]
	},
	{
		label: 'Storefront',
		items: [{
				title: 'EasyDeal Website',
				href: '/website',
				icon: Globe
			},
			// { title: 'Catalog', href: '/catalog', icon: Globe },
			{
				title: 'Website Analytics',
				href: '/analytics',
				icon: ChartSpline
			},	
			{
				title: 'Promos',
				href: '/promos',
				icon: Tag 
			}
		]
	},
	{
		label: 'Locations',
		items: [
			{ title: 'Shops', href: '/shops', icon: Store },
			{ title: 'Warehouses', href: '/warehouses', icon: Warehouse },
			{ title: 'Transfers', href: '/transfers', icon: ArrowRightLeft },
			{ title: 'Salepersons', href: '/salepersons', icon: Contact }
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
			{ title: 'Logs', href: '/logs', icon: ClipboardClock },
			{
				title: 'Settings',
				href: '/settings',
				icon: Settings
			}
		]
	}
];
