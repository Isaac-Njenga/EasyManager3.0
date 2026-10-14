<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { WebProduct } from '$lib/services/website/website.types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import Modal from '$lib/components/common/Modal.svelte';

	import { webProductService } from '$lib/services/website/website.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import { invalidateAll } from '$app/navigation';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import ProductDetails from '../../../../../routes/(app)/website/WebProductDetail.svelte';

	import { toast } from 'svelte-sonner';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		product
	}: {
		product: WebProduct;
	} = $props();

	let isDeleteWebProductOpen = $state(false);
	let isDetailModalOpen = $state(false);
	let selectedWebProduct = $state<WebProduct | null>(null);

	function viewWebProduct(webProduct: WebProduct) {
		selectedWebProduct = webProduct;
		isDetailModalOpen = true;
	}

	function editWebProduct(webProduct: WebProduct) {
		goto(resolve(`/website/${webProduct._id}/edit`));
	}

	function openDeleteModal(webProduct: WebProduct) {
		selectedWebProduct = webProduct;
		isDeleteWebProductOpen = false;
	}

	async function deleteItem(webProduct: WebProduct) {
		try {
			await webProductService.delete(getBrowserServiceContext(), webProduct._id);
			toast.success(`Item ${webProduct.name} deleted`);
			isDeleteWebProductOpen = false;
			selectedWebProduct = null;
			await invalidateAll();
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to delete item.';
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
		<DropdownMenu.Item onclick={() => viewWebProduct(product)}>View</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => editWebProduct(product)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="text-destructive focus:text-destructive"
			onclick={() => openDeleteModal(product)}
		>
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Modal bind:open={isDetailModalOpen}>
	{#if selectedWebProduct}
		<div class="no-scrollbar min-h-0 overflow-y-auto">
			<ProductDetails product={selectedWebProduct} isOpen={isDetailModalOpen} />
		</div>
	{/if}
	{#snippet footer()}
		<div class="flex w-full flex-row items-center justify-end gap-2">
			<Button
				size="xs"
				variant="default"
				onclick={() => {
					if (selectedWebProduct) {
						editWebProduct(selectedWebProduct);
					}
				}}
			>
				Edit
			</Button>
			<Button
				size="xs"
				variant="destructive"
				onclick={() => {
					if (selectedWebProduct) {
						openDeleteModal(selectedWebProduct);
					}
				}}
			>
				Delete
			</Button>
		</div>
	{/snippet}
</Modal>

<DeleteDialog
	bind:open={isDeleteWebProductOpen}
	handleDelete={() => selectedWebProduct && deleteItem(selectedWebProduct)}
/>
