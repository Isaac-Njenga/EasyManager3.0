import { createColumnHelper, renderSnippet, renderComponent } from '@tanstack/svelte-table';
import { createRawSnippet } from 'svelte';
import type { DataTableFeatures } from './features';
import ImageCell from './cells/image-cell.svelte';
import NameCell from './cells/name-cell.svelte';
import CodeCell from './cells/code-cell.svelte';
import ColourCell from './cells/colour-cell.svelte';
import QuantityCell from './cells/quantity-cell.svelte';
import QtyTransferCell from './cells/qty-transfer.svelte';
import DestinationCell from './cells/destination-cell.svelte';
import type { Product } from '$lib/services/product/product.types';
// import DataTableActions from './actions.svelte';
import DataTableCheckbox from './checkbox.svelte';

export type TransferTableProduct = Product & {
	sourceQuantity: number;
	quantityToTransfer: number;
	destinationQuantity: number;
	destinationHasProduct: boolean;
	destinationSelected: boolean;
	selectedForTransfer: boolean;
};

type TransferColumnCallbacks = {
	onQuantityChange: (productId: string, quantity: number) => void;
	onSelectionChange: (productId: string, selected: boolean) => void;
};

export function createProdColumns({
	onQuantityChange,
	onSelectionChange
}: TransferColumnCallbacks) {
	const columnHelper = createColumnHelper<DataTableFeatures, TransferTableProduct>();
	return columnHelper.columns([
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

		columnHelper.accessor('colour', {
				header: () => {
					const headerSnippet = createRawSnippet(() => ({
						render: () => `<div class="font-semibold text-center text-muted-foreground">Colour</div>`
					}));
					return renderSnippet(headerSnippet);
				},
				cell: ({ row }) => {
					return renderComponent(ColourCell, {
						colour: row.original.colour
					});
				}
			}),

		//this is the quantity that is present in the source
		columnHelper.accessor('totalQuantity', {
			header: () => {
				const headerSnippet = createRawSnippet(() => ({
					render: () =>
						`<div class="text-center font-semibold text-muted-foreground">Source Qty</div>`
				}));
				return renderSnippet(headerSnippet);
			},
			cell: ({ row }) => {
				return renderComponent(QuantityCell, {
					totalQuantity: row.original.sourceQuantity
				});
			}
		}),

		//this handles the inputting of number of items to transfer. cannot be more than the source
		columnHelper.display({
			id: 'input',
			header: () => {
				const headerSnippet = createRawSnippet(() => ({
					render: () =>
						`<div class="text-center font-semibold text-muted-foreground">Qty to Transfer</div>`
				}));
				return renderSnippet(headerSnippet);
			},
			cell: ({ row }) => {
				return renderComponent(QtyTransferCell, {
					productId: row.original._id,
					sourceQuantity: row.original.sourceQuantity,
					quantityToTransfer: row.original.quantityToTransfer,
					selected: row.original.selectedForTransfer,
					onQuantityChange
				});
			}
		}),

		columnHelper.display({
			id: 'destination',
			header: () => {
				const headerSnippet = createRawSnippet(() => ({
					render: () =>
						`<div class="text-center font-semibold text-muted-foreground">Destination Qty</div>`
				}));
				return renderSnippet(headerSnippet);
			},
			cell: ({ row }) => {
				return renderComponent(DestinationCell, {
					destinationSelected: row.original.destinationSelected,
					hasDestinationItem: row.original.destinationHasProduct,
					currentQuantity: row.original.destinationQuantity,
					quantityToTransfer: row.original.selectedForTransfer ? row.original.quantityToTransfer : 0
				});
			}
		}),
		columnHelper.display({
			id: 'select',
			header: () => {
				const headerSnippet = createRawSnippet(() => ({
					render: () => `<div class="text-left font-semibold text-muted-foreground">Select</div>`
				}));
				return renderSnippet(headerSnippet);
			},
			cell: ({ row }) =>
				renderComponent(DataTableCheckbox, {
					checked: row.original.selectedForTransfer,
					disabled: row.original.sourceQuantity <= 0,
					onCheckedChange: (value: boolean) => onSelectionChange(row.original._id, value === true),
					'aria-label': `Select ${row.original.name} for transfer`
				}),
			enableSorting: false,
			enableHiding: false
		})
	]);
}
