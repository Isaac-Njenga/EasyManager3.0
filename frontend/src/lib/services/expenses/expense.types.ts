export type ExpenseCategory =
	| 'Rent & Utilities'
	| 'Salaries & Wages'
	| 'Inventory & Supplies'
	| 'Marketing & Ads'
	| 'Transport & Logistics'
	| 'Maintenance & Repairs'
	| 'Licenses & Taxes'
	| 'Miscellaneous';

export type PaymentMethod = 'M-Pesa' | 'Cash' | 'Bank Transfer' | 'Credit Card';
export type ExpenseStatus = 'Paid' | 'Pending' | 'Cancelled';

export type Expense = {
	_id: string;
	expenseNumber: string; // e.g., EXP-2026-1001
	title: string;
	category: ExpenseCategory;
	amount: number;
	dateOfExpense: string; // ISO date string (YYYY-MM-DD)
	paymentMethod: PaymentMethod;
	paymentStatus: ExpenseStatus;
	payee: string; // Vendor, employee, or organization paid
	notes?: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateExpenseInput = {
	title: string;
	category: ExpenseCategory;
	amount: number;
	dateOfExpense: string;
	paymentMethod: PaymentMethod;
	paymentStatus: ExpenseStatus;
	payee?: string;
	notes?: string;
};

export type ExpenseListResponse = {
	expenses: Expense[];
	totalExpenses: number;
	currentPage: number;
	totalPages: number;
};
