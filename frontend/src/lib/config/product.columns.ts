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
		class: 'w-[80px]',
		cell: 'imageCell'
	},

	{
		key: 'name',
		header: 'Product',
		class: 'min-w-[220px]',
		cell: 'nameCell'
	},

	{
		key: 'code',
		header: 'Code'
	},

	{
		key: 'sku',
		header: 'SKU'
	},

	{
		key: 'category',
		header: 'Category'
	},

	{
		key: 'sellingPrice',
		header: 'Price',
		class: 'text-right',
		render: (value) => formatCurrency(Number(value ?? 0))
	},

	{
		key: 'quantity',
		header: 'Stock Qty',
		class: 'text-right',
		render: (value) => `${Number(value ?? 0)}`
	},

	{
		key: 'status',
		header: 'Status',
		// render: (value) => (value === 'Active' ? 'Active' : 'Inactive')
	},

	{
		key: 'actions',
		header: '',
		class: 'w-[50px] text-right',
		cell: 'actionsCell'
	}
];
