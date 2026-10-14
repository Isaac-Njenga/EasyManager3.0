import { createColumnHelper, renderSnippet, renderComponent } from '@tanstack/svelte-table';
import type { Sale } from '$lib/services/sales/sales.types';
import { createRawSnippet } from 'svelte';
import type { DataTableFeatures } from '../../table-test/features.ts';
import ReceiptCell from './cells/receipt-cell.svelte';
// import StatusCell from './cells/status-cell.svelte';
import ItemCell from './cells/item-cell.svelte';
// import CustomerCell from './cells/customer-cell.svelte';
import GrandTotalCell from './cells/total-cell.svelte';
import CommissionCell from './cells/commission-cell.svelte';
import DateCell from './cells/date-cell.svelte';
import DataTableActions from './actions.svelte';

const columnHelper = createColumnHelper<DataTableFeatures, Sale>();

export const SaleColumns = columnHelper.columns([
	columnHelper.accessor('receiptNumber', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Receipt</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(ReceiptCell, {
				receiptNumber: row.original.receiptNumber,
				saleperson: row.original.saleperson ?? { firstName: '', lastName: '' }
			});
		}
	}),
	columnHelper.accessor('items', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Purchase</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(ItemCell, {
				items: row.original.items
			});
		}
	}),
	// columnHelper.accessor('customer', {
	// 	header: () => {
	// 		const headerSnippet = createRawSnippet(() => ({
	// 			render: () => `<div class="font-semibold text-muted-foreground">Code</div>`
	// 		}));
	// 		return renderSnippet(headerSnippet);
	// 	},
	// 	cell: ({ row }) => {
	// 		return renderComponent(CustomerCell, {
	// 			customer: row.original.customer ?? { name: '', phone: '', }
	// 		});
	// 	}
	// }),
	columnHelper.accessor('grandTotal', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () =>
					`<div class="text-left font-semibold text-muted-foreground">Grand Total</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(GrandTotalCell, {
				grandTotal: row.original.grandTotal
			});
		}
	}),
	columnHelper.accessor('commission', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () =>
					`<div class="text-left font-semibold text-muted-foreground">Commission</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(CommissionCell, {
				commission: row.original.commission
			});
		}
	}),
	columnHelper.accessor('dateOfSale', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Date</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(DateCell, {
				dateOfSale: row.original.dateOfSale
			});
		}
	}),
	// columnHelper.accessor('status', {
	// 	header: () => {
	// 		const headerSnippet = createRawSnippet(() => ({
	// 			render: () => `<div class="font-semibold text-muted-foreground">Status</div>`
	// 		}));
	// 		return renderSnippet(headerSnippet);
	// 	},
	// 	cell: ({ row }) => {
	// 		return renderComponent(StatusCell, {
	// 			status: row.original.status
	// 		});
	// 	}
	// }),
	columnHelper.display({
		id: 'actions',
		header: () => '',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				sale: row.original
			});
		}
	})
]);
