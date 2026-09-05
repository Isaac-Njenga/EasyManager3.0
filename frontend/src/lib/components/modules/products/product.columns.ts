import type { TableColumn } from '$lib/types/table.types';
import type { Product } from '$lib/services/product/product.types';
import { formatCurrency } from '$lib/utils';

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
		class: 'max-w-[170px]',
		cell: 'nameCell'
	},

	{
		key: 'code',
		header: 'Code',
		class: 'max-w-[70px]',
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
		class: 'text-center'
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
