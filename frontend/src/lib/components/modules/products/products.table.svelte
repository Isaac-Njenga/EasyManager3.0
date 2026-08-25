<script lang="ts">
	import DataTable from '$lib/components/common/DataTable.svelte';
	import DataDrawer from '$lib/components/common/DataDrawer.svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	import { productColumns } from '$lib/components/modules/products/product.columns';
	import type { Product } from '$lib/types/product.types';
	import ProductsDetails from '../../../../routes/(app)/products/ProductDetails.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';

	type Props = {
		filteredProducts: Product[];
	};

	let { filteredProducts }: Props = $props();

	// 1. Reactive state variables using $state
	let isDrawerOpen = $state(false);
	let isDeleteProductOpen = $state(false);
	let selectedProduct = $state<Product | null>(null);

	function viewProduct(product: Product) {
		selectedProduct = product;
		isDrawerOpen = true;
	}

	function editProduct(product: Product) {
		// console.log('Edit product:', product._id);
		goto(resolve(`/products/${product._id}`));
	}

	function openDeleteModal(product: Product) {
		selectedProduct = product;
		isDeleteProductOpen = true;
	}

	function deleteProduct(product: Product) {
		console.log('Delete product:', product._id);
		isDeleteProductOpen = false;
		selectedProduct = null;
		isDrawerOpen = false;
	}
</script>

<!-- eslint-disable-next-line -->
{#snippet imageCell(_value: unknown, product: Product)}
	{#if product.image && product.image.length > 0}
		<img src={product.image[0]} alt={product.name} class="size-16 rounded-md" />
	{:else}
		<div class="flex size-12 items-center justify-center rounded-md border bg-muted">
			<span class="text-xs text-muted-foreground">No image</span>
		</div>
	{/if}
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet nameCell(_value: unknown, product: Product)}
	<div class="w-full">
		<div class="truncate font-medium">{product.name}</div>

		{#if product.category}
			<div class="truncate text-xs text-muted-foreground">
				Category: {product.category}
			</div>
		{/if}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet codeCell(_value: unknown, product: Product)}
	<div class="w-full">
		<p class="text-xs">Code: {product.code ?? ''}</p>
		<p class="text-xs text-muted-foreground">SKU: {product.sku ?? ''}</p>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet statusCell(_value: unknown, product: Product)}
	{#if product.status === 'Active'}
		<Badge
			variant="outline"
			class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
		>
			Active
		</Badge>
	{:else}
		<Badge
			variant="outline"
			class="border-zinc-500/30 bg-zinc-500/10 text-zinc-500 dark:text-zinc-400"
		>
			{product.status ?? 'Inactive'}
		</Badge>
	{/if}
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet qtyCell(_value: unknown, product: Product)}
	<div class="w-full">
		<p class="text-xs">{product.totalQuantity ?? ''}</p>
		<!-- low stock alert -->
		{#if product.totalQuantity <= 5}
			<p class="text-xs text-amber-500">Low stock</p>
		{/if}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet actionsCell(_value: unknown, product: Product)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button variant="ghost" size="icon" class="size-8" aria-label={`Actions for ${product.name}`}>
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewProduct(product)}>View</DropdownMenuItem>
			<DropdownMenuItem onclick={() => editProduct(product)}>Edit</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => openDeleteModal(product)}
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<!-- Data Table -->
<DataTable
	data={filteredProducts}
	columns={productColumns}
	getRowKey={(product) => product._id}
	emptyMessage="No products found."
	cells={{
		imageCell,
		nameCell,
		codeCell,
		actionsCell,
		qtyCell,
		statusCell
	}}
	pagination
	pageSize={10}
	pageSizeOptions={[10, 20, 50]}
/>

<!-- Reusable Product Drawer -->
<DataDrawer
	bind:open={isDrawerOpen}
	title={selectedProduct?.name ?? 'Product Details'}
	description={selectedProduct ? `CODE: ${selectedProduct.code}` : ''}
	direction="right"
>
	<ProductsDetails {selectedProduct} />
	{#snippet footer()}
		<div class="flex w-full flex-col gap-2">
			<!-- Top row: Edit and Delete take 50% width each -->
			<div class="grid w-full grid-cols-2 gap-2">
				<Button href={`/products/${selectedProduct?._id}`} size="xs" class="w-full">
					Edit Product
				</Button>
				<Button
					onclick={() => openDeleteModal(selectedProduct!)}
					size="xs"
					variant="destructive"
					class="w-full"
				>
					Delete Product
				</Button>
			</div>

			<!-- Bottom row: Close takes 100% width -->
			<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'xs', class: 'w-full' })}>
				Close
			</Drawer.Close>
		</div>
	{/snippet}
</DataDrawer>

<DeleteDialog
	bind:open={isDeleteProductOpen}
	handleDelete={() => deleteProduct(selectedProduct!)}
/>
