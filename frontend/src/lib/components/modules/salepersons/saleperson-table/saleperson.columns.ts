import { createColumnHelper, renderSnippet, renderComponent } from '@tanstack/svelte-table';
import type { Salesperson } from '$lib/services/salesperson/salesperson.types';
import { createRawSnippet } from 'svelte';
import type { DataTableFeatures } from '../../table-test/features.ts';
import CommissionCell from './cells/commission-cell.svelte';
import StatusCell from './cells/status-cell.svelte';
import NameCell from './cells/name-cell.svelte';
import ShopCell from './cells/shop-cell.svelte';
import RevenueCell from './cells/revenue-cell.svelte';
import DataTableActions from './actions.svelte';

const columnHelper = createColumnHelper<DataTableFeatures, Salesperson>();

export const SalepersonColumns = columnHelper.columns([
	columnHelper.display({
		id: 'saleperson',
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Saleperson</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(NameCell, {
				firstName: row.original.firstName,
				lastName: row.original.lastName,
				id: row.original._id
			});
		}
	}),
	columnHelper.display({
		id: 'assignedShop',
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Assigned Shop</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(ShopCell, {
				assignedShop: row.original.assignedShop ?? { name: '', shopCode: '', address: { town: '' } }
			});
		}
	}),
	columnHelper.display({
		id: 'totalCommission',
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Total Commission</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(CommissionCell, {
				performanceSummary: row.original.performanceSummary ?? { totalCommissionEarned: 0 }
			});
		}
	}),
	columnHelper.display({
		id: 'totalRevenue',
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-left font-semibold text-muted-foreground">Total Revenue</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(RevenueCell, {
				performanceSummary: row.original.performanceSummary ?? { totalRevenueGenerated: 0 }
			});
		}
	}),
	columnHelper.accessor('status', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Status</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(StatusCell, {
				status: row.original.status
			});
		}
	}),
	columnHelper.display({
		id: 'actions',
		header: () => '',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				salesperson: row.original
			});
		}
	})
]);
