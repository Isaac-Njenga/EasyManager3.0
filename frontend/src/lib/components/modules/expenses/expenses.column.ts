import type { TableColumn } from '$lib/types/table.types';
import type { Expense } from '$lib/types/expense.types';

export const expenseColumns: TableColumn<Expense>[] = [
	{
		key: 'expenseNumber',
		header: '#',
		class: 'max-w-[60px] text-xs font-semibold'
	},	{
		key: 'dateOfExpense',
		header: 'Date',
		class: 'max-w-[70px]',
		cell: 'dateCell'
	},
	{
		key: 'category',
		header: 'Expense',
		class: 'max-w-[160px]',
		cell: 'categoryCell'
	},

	{
		key: 'paymentStatus',
		header: 'Status',
		class: 'text-left max-w-[10px]',
		cell: 'statusCell'
	},
	{
		key: 'amount',
		header: 'Amount',
		class: 'text-right font-bold',
		cell: 'amountCell'
	},
	{
		key: 'actions',
		header: '',
		class: 'w-[50px] text-right',
		cell: 'actionsCell'
	}
];
