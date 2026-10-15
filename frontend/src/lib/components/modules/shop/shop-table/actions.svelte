<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Shop } from '$lib/services/shop/shop.types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Modal from '$lib/components/common/Modal.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import TransferForm from '$lib/components/modules/transfers/transfer.form.svelte';

	import type { Product } from '$lib/services/product/product.types';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import { invalidateAll } from '$app/navigation';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { shopService } from '$lib/services/shop/shop.service';
	import { transferStore } from '$lib/stores/transfers/transfer.svelte';
	import { toast } from 'svelte-sonner';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		shop,
		products
	}: {
		shop: Shop;
		products: Product[];
	} = $props();

	let isTransferDrawerOpen = $state(false);
	let isDeleteShopOpen = $state(false);
	let isSubmitting = $state(false);
	let selectedShop = $state<Shop | null>(null);

	function viewShop(shop: Shop) {
		selectedShop = shop;
		goto(resolve(`/shops/${shop._id}`));
	}

	function editShop(shop: Shop) {
		goto(resolve(`/shops/${shop._id}/edit`));
	}

	function openDeleteModal(shop: Shop) {
		selectedShop = shop;
		isDeleteShopOpen = true;
	}

	function transferStock(shop: Shop) {
		selectedShop = shop;
		transferStore.start(shop._id);
		isTransferDrawerOpen = true;
	}

	async function executeTransferAction() {
		isSubmitting = true;
		try {
			if (await transferStore.handleTransfer()) {
				isTransferDrawerOpen = false;
			}
		} catch (error) {
			toast.error('Transfer failed', {
				description:
					error instanceof Error ? error.message : 'Something went wrong. Please try again.'
			});
		} finally {
			isSubmitting = false;
		}
	}

	async function deleteShop(shop: Shop) {
		try {
			await shopService.delete(getBrowserServiceContext(), shop._id);
			toast.success('Shop deleted');
			isDeleteShopOpen = false;
			selectedShop = null;
			await invalidateAll();
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to delete shop.';
			toast.error('Shop deletion failed', { description });
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
		<DropdownMenu.Item onclick={() => viewShop(shop)}>View</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => editShop(shop)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => transferStock(shop)}>Transfer</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="text-destructive focus:text-destructive"
			onclick={() => openDeleteModal(shop)}
		>
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Modal
	bind:open={isTransferDrawerOpen}
	title={selectedShop?.name ?? 'Initiate Stock Transfer'}
	description={selectedShop ? selectedShop.shopCode : ''}
	contentClass="w-[calc(100vw-2rem)] sm:max-w-6xl"
>
	{#if selectedShop}
		<TransferForm preselectedSourceId={selectedShop._id} {products} />
	{/if}
	{#snippet footer()}
		<div class="flex w-full flex-row items-center justify-end gap-2">
			<Button
				size="xs"
				variant="default"
				disabled={!transferStore.canSubmit || isSubmitting}
				onclick={executeTransferAction}
				>{#if isSubmitting}
					<Loader2Icon class="size-4 animate-spin" /> Transferring...
				{:else}Initiate Transfer
				{/if}</Button
			>
			<Dialog.Close class={buttonVariants({ variant: 'outline', size: 'xs' })}>Close</Dialog.Close>
		</div>
	{/snippet}
</Modal>

<DeleteDialog bind:open={isDeleteShopOpen} handleDelete={() => deleteShop(selectedShop!)} />
