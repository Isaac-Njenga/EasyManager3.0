import { createColumnHelper, renderSnippet, renderComponent } from '@tanstack/svelte-table';
import type { WebProduct } from '$lib/services/website/website.types';
import { formatCurrency } from '$lib/utils';
import { createRawSnippet } from 'svelte';
import type { DataTableFeatures } from '../../table-test/features.ts';
import ImageCell from './cells/image-cell.svelte';
import StatusCell from './cells/status-cell.svelte';
import NameCell from './cells/name-cell.svelte';
import DiscountCell from './cells/discount-cell.svelte';
import DataTableActions from './actions.svelte';

const columnHelper = createColumnHelper<DataTableFeatures, WebProduct>();

export const WebProductColumns = columnHelper.columns([
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
				category: row.original.category ?? ''
			});
		}
	}),

	columnHelper.accessor('price', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-left font-semibold text-muted-foreground">Price</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			const priceSnippet = createRawSnippet<[{ price: number }]>(() => ({
				render: () =>
					`<div class="text-left font-medium text-foreground">
                        ${formatCurrency(row.original.price ?? 0)}
                    </div>`
			}));
			return renderSnippet(priceSnippet, {
				price: row.original.price
			});
		}
	}),
	columnHelper.accessor('discount', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () =>
					`<div class="text-left font-semibold text-muted-foreground">Discount</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(DiscountCell, {
				discount: row.original.discount
			});
		}
	}),
	columnHelper.accessor('inStock', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Status</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(StatusCell, {
				inStock: row.original.inStock ?? false
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
