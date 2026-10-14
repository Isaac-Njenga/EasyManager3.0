import { createColumnHelper, renderSnippet, renderComponent } from '@tanstack/svelte-table';
import type { Warehouse } from '$lib/services/warehouse/warehouse.types';
import type { Product } from '$lib/services/product/product.types';
import { createRawSnippet } from 'svelte';
import type { DataTableFeatures } from '../../table-test/features.ts';
import StatusCell from './cells/status-cell.svelte';
import NameCell from './cells/name-cell.svelte';
import StockCell from './cells/stock-cell.svelte';
import DataTableActions from './actions.svelte';

const columnHelper = createColumnHelper<DataTableFeatures, Warehouse>();

export function createWarehouseColumns(products: Product[]) {
	return columnHelper.columns([
		columnHelper.accessor('warehouseCode', {
			header: () => {
				const headerSnippet = createRawSnippet(() => ({
					render: () => `<div class="text-left font-semibold text-muted-foreground">Code</div>`
				}));
				return renderSnippet(headerSnippet);
			},
			cell: ({ row }) => {
				const codeSnippet = createRawSnippet<[{ warehouseCode: string }]>(() => ({
					render: () =>
						`<div class="font-mono text-xs text-left font-medium text-foreground">
                        ${row.original.warehouseCode}
                    </div>`
				}));
				return renderSnippet(codeSnippet, {
					warehouseCode: row.original.warehouseCode
				});
			}
		}),
		columnHelper.accessor('name', {
			header: () => {
				const headerSnippet = createRawSnippet(() => ({
					render: () => `<div class="font-semibold text-muted-foreground">Name</div>`
				}));
				return renderSnippet(headerSnippet);
			},
			cell: ({ row }) => {
				return renderComponent(NameCell, {
					name: row.original.name,
					address: row.original.address
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
		columnHelper.accessor('inventorySummary', {
			header: () => {
				const headerSnippet = createRawSnippet(() => ({
					render: () =>
						`<div class="text-left font-semibold text-muted-foreground">Stock Level</div>`
				}));
				return renderSnippet(headerSnippet);
			},
			cell: ({ row }) => {
				return renderComponent(StockCell, {
					inventorySummary: row.original.inventorySummary ?? {
						totalItemsInStock: 0,
						totalProducts: 0
					}
				});
			}
		}),
		columnHelper.display({
			id: 'actions',
			header: () => '',
			cell: ({ row }) => {
				return renderComponent(DataTableActions, {
					warehouse: row.original,
					products
				});
			}
		})
	]);
}
