<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Product } from '$lib/services/product/product.types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import DataDrawer from '$lib/components/common/DataDrawer.svelte';

	import ProductsDetails from '../../../../../routes/(app)/products/[id]/+page.svelte';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import { invalidateAll } from '$app/navigation';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { productService } from '$lib/services/product/product.service';
	import { toast } from 'svelte-sonner';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		product
	}: {
		product: Product;
	} = $props();

	let isDrawerOpen = $state(false);
	let isDeleteProductOpen = $state(false);
	let selectedProduct = $state<Product | null>(null);

	function editProduct(product: Product) {
		goto(resolve(`/products/${product._id}/edit`));
	}

	export function viewProduct(product: Product) {
		selectedProduct = product;
		isDrawerOpen = true;
	}

	export function openDeleteModal(product: Product) {
		selectedProduct = product;
		isDeleteProductOpen = true;
	}

	async function deleteProduct(product: Product) {
		try {
			await productService.delete(getBrowserServiceContext(), product._id);
			toast.success('Product deleted');
			isDeleteProductOpen = false;
			selectedProduct = null;
			isDrawerOpen = false;
			await invalidateAll();
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to delete product.';
			toast.error('Product deletion failed', { description });
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<MoreHorizontal />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => viewProduct(product)}>View</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => editProduct(product)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="text-destructive focus:text-destructive"
			onclick={() => openDeleteModal(product)}
		>
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

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
