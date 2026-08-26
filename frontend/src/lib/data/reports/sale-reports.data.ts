// $lib/data/reports/salesReports.data.ts

export interface SalesTransaction {
	orderId: string;
	customerName: string;
	customerEmail: string;
	date: string;
	itemsCount: number;
	paymentMethod: 'M-PESA' | 'Credit Card' | 'Bank Transfer' | 'Cash';
	totalAmount: number;
	status: 'Completed' | 'Pending' | 'Refunded';
}

export const salesTransactions: SalesTransaction[] = [
	{
		orderId: 'ORD-2026-8901',
		customerName: 'Amina Mohamed',
		customerEmail: 'amina.m@example.com',
		date: '2026-08-25 14:32',
		itemsCount: 3,
		paymentMethod: 'M-PESA',
		totalAmount: 145000,
		status: 'Completed'
	},
	{
		orderId: 'ORD-2026-8902',
		customerName: 'Kiprono Cheruiyot',
		customerEmail: 'k.cheruiyot@example.com',
		date: '2026-08-25 12:15',
		itemsCount: 1,
		paymentMethod: 'Credit Card',
		totalAmount: 320000,
		status: 'Completed'
	},
	{
		orderId: 'ORD-2026-8903',
		customerName: 'Kilimani Design Hub',
		customerEmail: 'procurement@kilimanidesign.co.ke',
		date: '2026-08-24 16:45',
		itemsCount: 12,
		paymentMethod: 'Bank Transfer',
		totalAmount: 1280000,
		status: 'Completed'
	},
	{
		orderId: 'ORD-2026-8904',
		customerName: 'David Ochieng',
		customerEmail: 'd.ochieng@example.com',
		date: '2026-08-24 10:05',
		itemsCount: 2,
		paymentMethod: 'M-PESA',
		totalAmount: 85000,
		status: 'Pending'
	},
	{
		orderId: 'ORD-2026-8905',
		customerName: 'Grace Wanjiku',
		customerEmail: 'gwanjiku@example.com',
		date: '2026-08-23 15:20',
		itemsCount: 4,
		paymentMethod: 'M-PESA',
		totalAmount: 210000,
		status: 'Refunded'
	}
];

export const salesChannelBreakdown = [
	{ channel: 'Online Store', revenue: 4850000, percentage: 52.0, orders: 340 },
	{ channel: 'In-Store POS', revenue: 2980000, percentage: 32.0, orders: 215 },
	{ channel: 'B2B Wholesale', revenue: 1490000, percentage: 16.0, orders: 28 }
];

export const paymentMethodBreakdown = [
	{ method: 'M-PESA', percentage: 64, count: 373 },
	{ method: 'Credit Card', percentage: 22, count: 128 },
	{ method: 'Bank Transfer', percentage: 10, count: 58 },
	{ method: 'Cash', percentage: 4, count: 24 }
];
