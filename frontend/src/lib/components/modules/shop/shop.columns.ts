import type { TableColumn } from '$lib/types/table.types';
import type { Shop } from '$lib/services/shop/shop.types';

export const shopColumns: TableColumn<Shop>[] = [
	{
		key: 'shopCode',
		header: 'Code',
		class: 'px-3 max-w-[40px]',
		cell: 'codeCell'
	},

	{
		key: 'name',
		header: 'Shop Name',
		class: 'max-w-[100px]',
		cell: 'nameCell'
	},

	{
		key: 'address',
		header: 'Location',
		class: 'max-w-[50px]',
		render: (value) => (value as Shop['address'])?.town ?? 'N/A'
	},

	{
		key: 'status',
		header: 'Status',
		class: 'text-left max-w-[50px]',
		cell: 'statusCell'
	},

	{
		key: 'inventorySummary',
		header: 'Stock Level',
		class: 'text-left max-w-[60px]',
		cell: 'stockCell'
	},

	{
		key: 'actions',
		header: '',
		class: 'w-[50px] text-right',
		cell: 'actionsCell'
	}
];
