import type { TableColumn } from '$lib/types/table.types';
import type { Salesperson } from '$lib/types/saleperson.types';
import { formatCurrency } from '$lib/utils';

export const salespersonColumns: TableColumn<Salesperson>[] = [
	{
		key: 'firstName',
		header: 'Salesperson',
		class: 'max-w-[150px]',
		cell: 'nameCell'
	},
	{
		key: 'assignedShop',
		header: 'Shop',
		class: 'max-w-[100px]',
		cell: 'shopCell'
	},
	{
		key: 'totalCommission',
		header: 'Total Commission',
		class: 'text-right',
		render: (value) => formatCurrency(Number(value ?? 0))
	},
	// {
	// 	key: 'hireDate',
	// 	header: 'Hire Date',
	// 	class: 'text-center min-w-[110px]',
	// 	cell: 'hireDateCell'
	// },
	{
		key: 'status',
		header: 'Status',
		class: 'text-center',
		cell: 'statusCell'
	},
	{
		key: 'actions',
		header: '',
		class: 'w-auto text-center',
		cell: 'actionsCell'
	}
];
