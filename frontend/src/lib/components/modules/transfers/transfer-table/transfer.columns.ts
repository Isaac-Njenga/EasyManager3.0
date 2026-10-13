import { createColumnHelper, renderSnippet, renderComponent } from '@tanstack/svelte-table';
import type { InventoryTransfer as Transfer } from '$lib/services/transfers/transfer.types';
import { createRawSnippet } from 'svelte';
import type { DataTableFeatures } from '../../table-test/features.ts';
import TypeCell from './cells/type-cell.svelte';
import DateCell from './cells/date-cell.svelte';
import SourceCell from './cells/source-cell.svelte';
import DestinationCell from './cells/destination-cell.svelte';
import TotalCell from './cells/total-count-cell.svelte';
import DataTableActions from './actions.svelte';

const columnHelper = createColumnHelper<DataTableFeatures, Transfer>();

export const TransferColumns = columnHelper.columns([
	columnHelper.accessor('transferNumber', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-left font-semibold text-muted-foreground">Code</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			const codeSnippet = createRawSnippet<[{ transferNumber: string }]>(() => ({
				render: () =>
					`<div class="font-mono text-xs text-left font-medium text-foreground">
                        ${row.original.transferNumber}
                    </div>`
			}));
			return renderSnippet(codeSnippet, {
				transferNumber: row.original.transferNumber
			});
		}
	}),
	columnHelper.accessor('source', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Source</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(SourceCell, {
				source: { locationId: row.original.source.locationId.name }
			});
		}
	}),
	columnHelper.accessor('destination', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Destination</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(DestinationCell, {
				destination: { locationId: row.original.destination.locationId.name }
			});
		}
	}),
	columnHelper.accessor('type', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-left font-semibold text-muted-foreground">Type</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(TypeCell, {
				type: row.original.type
			});
		}
	}),
	columnHelper.accessor('totalItemsCount', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () =>
					`<div class="text-center font-semibold text-muted-foreground">Total Count</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(TotalCell, {
				totalItemsCount: String(row.original.totalItemsCount)
			});
		}
	}),
	columnHelper.accessor('dateOfTransfer', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () =>
					`<div class="text-center font-semibold text-muted-foreground">Date Of Transfer</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(DateCell, {
				dateOfTransfer: row.original.dateOfTransfer
			});
		}
	}),
	columnHelper.display({
		id: 'actions',
		header: () => '',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				transfer: row.original
			});
		}
	})
]);
