// $lib/data/reports/expenseReports.data.ts

export interface ExpenseRecord {
	expenseId: string;
	description: string;
	category:
		| 'Rent & Utilities'
		| 'Payroll & Logistics'
		| 'Inventory & Supplies'
		| 'Marketing'
		| 'Maintenance';
	vendor: string;
	date: string;
	paymentType: 'Recurring' | 'One-off';
	amount: number;
	status: 'Paid' | 'Pending Approval' | 'Overdue';
}

export const expenseRecords: ExpenseRecord[] = [
	{
		expenseId: 'EXP-2026-041',
		description: 'Kilimani Showroom Monthly Rent',
		category: 'Rent & Utilities',
		vendor: 'Kilimani Real Estate Ltd',
		date: '2026-08-01',
		paymentType: 'Recurring',
		amount: 350000,
		status: 'Paid'
	},
	{
		expenseId: 'EXP-2026-042',
		description: 'Inter-warehouse Freight & Transport',
		category: 'Payroll & Logistics',
		vendor: 'Speedy Couriers Kenya',
		date: '2026-08-12',
		paymentType: 'One-off',
		amount: 85000,
		status: 'Paid'
	},
	{
		expenseId: 'EXP-2026-043',
		description: 'Raw Teak Wood Timber Procurement',
		category: 'Inventory & Supplies',
		vendor: 'Mombasa Timber Imports',
		date: '2026-08-18',
		paymentType: 'One-off',
		amount: 620000,
		status: 'Paid'
	},
	{
		expenseId: 'EXP-2026-044',
		description: 'Social Media & Billboard Campaign',
		category: 'Marketing',
		vendor: 'Nairobi Digital Ads Agency',
		date: '2026-08-20',
		paymentType: 'Recurring',
		amount: 140000,
		status: 'Pending Approval'
	},
	{
		expenseId: 'EXP-2026-045',
		description: 'Showroom AC Servicing & Generator Fuel',
		category: 'Maintenance',
		vendor: 'PowerTech Services',
		date: '2026-08-22',
		paymentType: 'One-off',
		amount: 45000,
		status: 'Paid'
	}
];

export const expenseCategoryBreakdown = [
	{ category: 'Inventory & Supplies', amount: 1850000, percentage: 48.0 },
	{ category: 'Rent & Utilities', amount: 820000, percentage: 21.3 },
	{ category: 'Payroll & Logistics', amount: 640000, percentage: 16.6 },
	{ category: 'Marketing', amount: 350000, percentage: 9.1 },
	{ category: 'Maintenance', amount: 190000, percentage: 5.0 }
];
