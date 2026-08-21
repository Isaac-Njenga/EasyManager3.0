import type { Expense } from '$lib/types/expense.types';

export const expensesData: Expense[] = [
	{
		_id: 'exp-001',
		expenseNumber: 'EXP-2026-1001',
		title: 'Showroom Monthly Rent - August',
		category: 'Rent & Utilities',
		amount: 45000,
		dateOfExpense: '2026-08-01',
		paymentMethod: 'Bank Transfer',
		paymentStatus: 'Paid',
		payee: 'Westlands Commercial Properties',
		notes: 'Paid August rent via wire transfer.',
		createdAt: '2026-08-01T08:30:00Z',
		updatedAt: '2026-08-01T08:30:00Z'
	},
	{
		_id: 'exp-002',
		expenseNumber: 'EXP-2026-1002',
		title: 'Electricity & Internet Bill',
		category: 'Rent & Utilities',
		amount: 12500,
		dateOfExpense: '2026-08-05',
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		payee: 'Kenya Power / Safaricom Business',
		notes: 'KPLC token top-up and Fiber Internet renewal.',
		createdAt: '2026-08-05T10:15:00Z',
		updatedAt: '2026-08-05T10:15:00Z'
	},
	{
		_id: 'exp-003',
		expenseNumber: 'EXP-2026-1003',
		title: 'Local Delivery Logistics (Thika Route)',
		category: 'Transport & Logistics',
		amount: 6800,
		dateOfExpense: '2026-08-10',
		paymentMethod: 'M-Pesa',
		paymentStatus: 'Paid',
		payee: 'Rider Express Services',
		notes: 'Customer deliveries for sofa units.',
		createdAt: '2026-08-10T14:20:00Z',
		updatedAt: '2026-08-10T14:20:00Z'
	},
	{
		_id: 'exp-004',
		expenseNumber: 'EXP-2026-1004',
		title: 'Social Media Ad Campaign (Meta)',
		category: 'Marketing & Ads',
		amount: 18000,
		dateOfExpense: '2026-08-12',
		paymentMethod: 'Credit Card',
		paymentStatus: 'Paid',
		payee: 'Meta Ads Manager',
		notes: 'Instagram & Facebook promo for August clearance sale.',
		createdAt: '2026-08-12T09:00:00Z',
		updatedAt: '2026-08-12T09:00:00Z'
	},
	{
		_id: 'exp-005',
		expenseNumber: 'EXP-2026-1005',
		title: 'Raw Timber & Upholstery Supplies',
		category: 'Inventory & Supplies',
		amount: 78500,
		dateOfExpense: '2026-08-15',
		paymentMethod: 'Bank Transfer',
		paymentStatus: 'Pending',
		payee: 'Nairobi Timber Millers Ltd',
		notes: 'Awaiting invoice clearance before dispatch.',
		createdAt: '2026-08-15T11:45:00Z',
		updatedAt: '2026-08-15T11:45:00Z'
	},
	{
		_id: 'exp-006',
		expenseNumber: 'EXP-2026-1006',
		title: 'Aircon Maintenance & Filter Replacement',
		category: 'Maintenance & Repairs',
		amount: 4500,
		dateOfExpense: '2026-08-18',
		paymentMethod: 'Cash',
		paymentStatus: 'Paid',
		payee: 'Cooling Solutions Ltd',
		createdAt: '2026-08-18T15:10:00Z',
		updatedAt: '2026-08-18T15:10:00Z'
	}
];
