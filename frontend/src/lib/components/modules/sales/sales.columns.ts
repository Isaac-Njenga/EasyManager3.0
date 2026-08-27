import type { TableColumn } from '$lib/types/table.types';
import type { Sale } from '$lib/types/sale.types';

export const saleColumns: TableColumn<Sale>[] = [
	{
		key: 'receiptNumber',
		header: 'Receipt',
		class: 'w-[140px]',
		cell: 'receiptCell'
	},
	{
		key: 'items',
		header: 'Items',
		class: 'max-w-[120px]',
		cell: 'itemsCell'
	},
	{
		key: 'customer',
		header: 'Customer',
		class: 'w-auto',
		cell: 'customerCell'
	},

	{
		key: 'grandTotal',
		header: 'Total',
		class: 'text-left',
		cell: 'totalCell'
	},{
		key: 'commission',
		header: 'Commission',
		class: 'text-left',
		cell: 'commissionCell'
	},
	{
		key: 'status',
		header: 'Status',
		class: 'text-left ',
		cell: 'statusCell'
	},
	{
		key: 'createdAt',
		header: 'Date',
		class: 'text-right',
		cell: 'dateCell'
	},
	{
		key: 'actions',
		header: '',
		class: 'w-[50px] text-right',
		cell: 'actionsCell'
	}
];
