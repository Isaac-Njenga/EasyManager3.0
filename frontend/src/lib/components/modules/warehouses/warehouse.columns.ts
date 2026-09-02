import type { TableColumn } from '$lib/types/table.types';
import type { Warehouse } from '$lib/services/warehouse/warehouse.types';

export const warehouseColumns: TableColumn<Warehouse>[] = [
	{
		key: 'warehouseCode',
		header: 'Code',
		cell: 'codeCell',
		class: 'px-3 max-w-[30px]'
	},
	{
		key: 'name',
		header: 'Warehouse',
		cell: 'nameCell',
		class: 'max-w-[80px]'
	},
	{
		key: 'address',
		header: 'Location',
		class: 'max-w-[60px]',
		cell: 'locationCell'
	},
	{
		key: 'status',
		header: 'Status',
		cell: 'statusCell',
		class: 'text-left max-w-[40px]'
	},
	{
		key: 'inventorySummary',
		header: 'Stock Level',
		cell: 'stockCell',
		class: 'text-left max-w-[30px]'
	},
	{
		key: 'actions',
		header: '',
		cell: 'actionsCell',
		class: 'w-[50px] text-right'
	}
];
