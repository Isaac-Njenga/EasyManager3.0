import { createColumnHelper, renderSnippet, renderComponent } from '@tanstack/svelte-table';
import type { Expense } from '$lib/services/expenses/expense.types';
import { createRawSnippet } from 'svelte';
import type { DataTableFeatures } from '../../table-test/features.ts';
import CategoryCell from './cells/category-cell.svelte';
import DateCell from './cells/date-cell.svelte';
import AmountCell from './cells/amount-cell.svelte';
import StatusCell from './cells/status-cell.svelte';
import NumberCell from './cells/number-cell.svelte';
import DataTableActions from './actions.svelte';

const columnHelper = createColumnHelper<DataTableFeatures, Expense>();

export const ExpenseColumns = columnHelper.columns([
	columnHelper.accessor('expenseNumber', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-center font-semibold text-muted-foreground">Expense</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(NumberCell, {
				expenseNumber: row.original.expenseNumber
			});
		}
	}),
	columnHelper.accessor('dateOfExpense', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-left font-semibold text-muted-foreground">Date</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(DateCell, {
				dateOfExpense: row.original.dateOfExpense
			});
		}
	}),
	columnHelper.accessor('amount', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-center font-semibold text-muted-foreground">Amount</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(AmountCell, {
				amount: row.original.amount
			});
		}
	}),
	columnHelper.accessor('category', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-left font-semibold text-muted-foreground">Category</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(CategoryCell, {
				title: row.original.title,
				category: row.original.category
			});
		}
	}),
	columnHelper.accessor('paymentStatus', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-center font-semibold text-muted-foreground">Status</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(StatusCell, {
				paymentStatus: row.original.paymentStatus
			});
		}
	}),

	columnHelper.display({
		id: 'actions',
		header: () => '',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				expense: row.original
			});
		}
	})
]);
