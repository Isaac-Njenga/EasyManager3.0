import {
	LayoutDashboard,
	ShoppingCart,
	Package,
	Receipt,
	ChartNoAxesCombined,
	Settings
} from '@lucide/svelte';

export const navigation = [
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard
	},
	{
		title: 'Sales',
		href: '/sales',
		icon: ShoppingCart
	},
	{
		title: 'Products',
		href: '/products',
		icon: Package
	},
	{
		title: 'Expenses',
		href: '/expenses',
		icon: Receipt
	},
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
] as const;
