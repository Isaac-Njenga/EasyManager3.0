import type { TableColumn } from '$lib/types/table.types';
import type { Sale } from '$lib/types/sale.types';

export const formatCurrency = (value: number) =>
	new Intl.NumberFormat('en-KE', {
		style: 'currency',
		currency: 'KES',
		minimumFractionDigits: 0
	}).format(Number(value ?? 0));

// const formatDate = (dateStr: string) => {
// 	if (!dateStr) return '';
// 	return new Date(dateStr).toLocaleDateString('en-KE', {
// 		month: 'short',
// 		day: 'numeric',
// 		year: 'numeric'
// 	});
// };

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
		class: 'min-w-[200px]',
		cell: 'itemsCell'
	},
	{
		key: 'customer',
		header: 'Customer',
		class: 'min-w-[140px]',
		cell: 'customerCell'
	},
	{
		key: 'paymentMethod',
		header: 'Payment',
		class: 'w-[120px]',
		cell: 'paymentCell'
	},
	{
		key: 'grandTotal',
		header: 'Total',
		class: 'text-right w-[110px]',
		cell: 'totalCell'
		// render: (sale: unknown) => formatCurrency(sale.grandTotal)
	},
	{
		key: 'status',
		header: 'Status',
		class: 'text-center w-[110px]',
		cell: 'statusCell'
	},
	{
		key: 'createdAt',
		header: 'Date',
		class: 'text-right w-[110px]',
		cell: 'dateCell'
		// render: (sale) => formatDate(sale.createdAt)
	},
	{
		key: 'actions',
		header: '',
		class: 'w-[50px] text-right',
		cell: 'actionsCell'
	}
];
