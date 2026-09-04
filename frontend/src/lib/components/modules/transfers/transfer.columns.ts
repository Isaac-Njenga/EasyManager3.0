// $lib/components/modules/transfers/transfer.columns.ts
import type { TableColumn } from '$lib/types/table.types';
import type { InventoryTransfer } from '$lib/services/transfers/transfer.types';

export const transferColumns: TableColumn<InventoryTransfer>[] = [
	{
		key: 'transferNumber',
		header: '#',
		cell: 'codeCell',
		class:'text-center'
	},
	{
		key: 'source',
		header: 'Source',
		cell: 'SourceCell'
	},
	{
		key: 'destination',
		header: 'Destination',
		cell: 'DestinationCell'
	},
	{
		key: 'type',
		header: 'Type',
		cell: 'typeCell'
	},
	{
		key: 'totalItemsCount',
		header: 'Items Transferred',
		class: 'text-center',
		cell: 'itemsCountCell'
	},
	{
		key: 'dateOfTransfer',
		header: 'Date',
		cell: 'dateCell'
	},
	{
		key: 'actions',
		header: '',
		cell: 'actionsCell',
		class: 'w-[50px] text-right'
	}
];
