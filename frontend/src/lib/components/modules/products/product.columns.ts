import type { TableColumn } from '$lib/types/table.types';
import type { Product } from '$lib/types/product.types';

const formatCurrency = (value: number) =>
	new Intl.NumberFormat('en-KE', {
		style: 'currency',
		currency: 'KES'
	}).format(Number(value ?? 0));

export const productColumns: TableColumn<Product>[] = [
	{
		key: 'image',
		header: 'Image',
		class: 'max-w-[60px]',
		cell: 'imageCell'
	},

	{
		key: 'name',
		header: 'Product',
		class: 'max-w-[160px]',
		cell: 'nameCell'
	},

	{
		key: 'code',
		header: 'Code',
		class: 'max-w-[100px]',
		cell: 'codeCell'
	},

	{
		key: 'sellingPrice',
		header: 'Price',
		class: 'text-right',
		render: (value) => formatCurrency(Number(value ?? 0))
	},

	{
		key: 'quantity',
		header: 'Quantity',
		cell: 'qtyCell',
		class: 'text-right'
		// render: (value) => `${Number(value ?? 0)}`
	},

	{
		key: 'status',
		header: 'Status',
		class: 'text-center',
		cell: 'statusCell'
		// render: (value) => (value === 'Active' ? 'Active' : 'Inactive')
	},

	{
		key: 'actions',
		header: '',
		class: 'w-[50px] text-right',
		cell: 'actionsCell'
	}
];
