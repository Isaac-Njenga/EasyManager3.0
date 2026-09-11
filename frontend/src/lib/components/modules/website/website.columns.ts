import type { WebProduct } from '$lib/services/website/website.types';
import type { TableColumn } from '$lib/types/table.types';

export const websiteColumns: TableColumn<WebProduct>[] = [
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
		key: 'price',
		header: 'Price',
		cell: 'priceCell'
	},
	{
		key: 'discount',
		header: 'Discount',
		cell: 'discountCell'
	},
	{
		key: 'inStock',
		header: 'Status',
		cell: 'inStockCell'
	},
	{
		key: 'actions',
		header: '',
		cell: 'actionsCell'
	}
];
