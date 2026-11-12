import { createColumnHelper, renderSnippet, renderComponent } from '@tanstack/svelte-table';
import {
	catalogDiscount,
	categoryName,
	type WebProduct
} from '$lib/services/website/website.types';
import { formatCatalogPrice } from '$lib/services/website/website.types';
import { createRawSnippet } from 'svelte';
import type { DataTableFeatures } from '../../table-test/features.ts';
import ImageCell from './cells/image-cell.svelte';
import StatusCell from './cells/status-cell.svelte';
import NameCell from './cells/name-cell.svelte';
import DiscountCell from './cells/discount-cell.svelte';
import DataTableActions from './actions.svelte';

const columnHelper = createColumnHelper<DataTableFeatures, WebProduct>();

export const WebProductColumns = columnHelper.columns([
	columnHelper.accessor('images', {
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="font-semibold text-muted-foreground">Image</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(ImageCell, {
				image: row.original.images,
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
				category: categoryName(row.original.category)
			});
		}
	}),

	columnHelper.accessor('pricing.basePrice', {
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
                        ${formatCatalogPrice(row.original.pricing.basePrice ?? 0, row.original.pricing.currency)}
                    </div>`
			}));
			return renderSnippet(priceSnippet, {
				price: row.original.pricing.basePrice
			});
		}
	}),
	columnHelper.accessor((row) => catalogDiscount(row), {
		id: 'discount',
		header: () => {
			const headerSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-left font-semibold text-muted-foreground">Discount</div>`
			}));
			return renderSnippet(headerSnippet);
		},
		cell: ({ row }) => {
			return renderComponent(DiscountCell, {
				discount: catalogDiscount(row.original)
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
