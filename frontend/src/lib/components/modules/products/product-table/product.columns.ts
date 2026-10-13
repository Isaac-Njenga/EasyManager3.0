import { createColumnHelper, renderSnippet, renderComponent } from '@tanstack/svelte-table';
import type { Product } from '$lib/services/product/product.types';
import { formatCurrency } from '$lib/utils';
import { createRawSnippet } from 'svelte';
import type { DataTableFeatures } from '../../table-test/features.ts';
import ImageCell from './cells/image-cell.svelte';
import StatusCell from './cells/status-cell.svelte';
import NameCell from './cells/name-cell.svelte';
import CodeCell from './cells/code-cell.svelte';
import QuantityCell from './cells/quantity-cell.svelte';
import DataTableActions from './actions.svelte';

const columnHelper = createColumnHelper<DataTableFeatures, Product>();

export const ProductColumns = columnHelper.columns([
	columnHelper.accessor('image', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Image</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(ImageCell, {
				image: row.original.image,
				name: row.original.name
			});
		}
	}),
	columnHelper.accessor('name', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Product</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(NameCell, {
				name: row.original.name,
				category: row.original.category
			});
		}
	}),
	columnHelper.accessor('code', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Code</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(CodeCell, {
				code: row.original.code,
				sku: row.original.sku
			});
		}
	}),
	columnHelper.accessor('sellingPrice', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-right font-semibold text-muted-foreground">Price</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			const priceSnippet = createRawSnippet<[{ sellingPrice: number }]>(() => ({
				render: () =>
					`<div class="text-right font-medium text-foreground">
                        ${formatCurrency(row.original.sellingPrice ?? 0)}
                    </div>`
			}));
			return renderSnippet(priceSnippet, {
				sellingPrice: row.original.sellingPrice
			});
		}
	}),
	columnHelper.accessor('totalQuantity', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () =>
					`<div class="text-center font-semibold text-muted-foreground">Total Quantity</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(QuantityCell, {
				totalQuantity: row.original.totalQuantity
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
				product: row.original
			});
		}
	})
]);
