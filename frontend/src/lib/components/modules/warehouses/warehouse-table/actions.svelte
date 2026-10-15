<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Warehouse } from '$lib/services/warehouse/warehouse.types';
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
	import { warehouseService } from '$lib/services/warehouse/warehouse.service';
	import { transferStore } from '$lib/stores/transfers/transfer.svelte';
	import { toast } from 'svelte-sonner';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		warehouse,
		products
	}: {
		warehouse: Warehouse;
		products: Product[];
	} = $props();

	let isTransferDrawerOpen = $state(false);
	let isDeleteWarehouseOpen = $state(false);
	let isSubmitting = $state(false);
	let selectedWarehouse = $state<Warehouse | null>(null);

	function viewWarehouse(warehouse: Warehouse) {
		selectedWarehouse = warehouse;
		goto(resolve(`/warehouses/${warehouse._id}`));
		// isDrawerOpen = true;
	}

	function editWarehouse(warehouse: Warehouse) {
		goto(resolve(`/warehouses/${warehouse._id}/edit`));
	}

	function openDeleteModal(warehouse: Warehouse) {
		selectedWarehouse = warehouse;
		isDeleteWarehouseOpen = true;
	}

	function transferStock(warehouse: Warehouse) {
		selectedWarehouse = warehouse;
		transferStore.start(warehouse._id);
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

	async function deleteWarehouse(warehouse: Warehouse) {
		try {
			await warehouseService.delete(getBrowserServiceContext(), warehouse._id);
			toast.success('Warehouse deleted');
			isDeleteWarehouseOpen = false;
			selectedWarehouse = null;
			await invalidateAll();
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to delete warehouse.';
			toast.error('Warehouse deletion failed', { description });
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
		<DropdownMenu.Item onclick={() => viewWarehouse(warehouse)}>View</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => editWarehouse(warehouse)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => transferStock(warehouse)}>Transfer</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="text-destructive focus:text-destructive"
			onclick={() => openDeleteModal(warehouse)}
		>
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Modal
	bind:open={isTransferDrawerOpen}
	title={selectedWarehouse?.name ?? 'Initiate Stock Transfer'}
	description={selectedWarehouse ? selectedWarehouse.warehouseCode : ''}
	contentClass="w-[calc(100vw-2rem)] sm:max-w-6xl"
>
	{#if selectedWarehouse}
		<TransferForm preselectedSourceId={selectedWarehouse._id} {products} />
	{/if}
	{#snippet footer()}
		<div class="flex w-full flex-row items-center justify-end gap-2">
			<Button
				size="xs"
				variant="default"
				disabled={transferStore.items.length === 0 || isSubmitting}
				onclick={executeTransferAction}
			>
				{#if isSubmitting}
					<Loader2Icon class="size-4 animate-spin" /> Transferring...
				{:else}Initiate Transfer
				{/if}
			</Button>
			<Dialog.Close class={buttonVariants({ variant: 'outline', size: 'xs' })}>Close</Dialog.Close>
		</div>
	{/snippet}
</Modal>

<DeleteDialog
	bind:open={isDeleteWarehouseOpen}
	handleDelete={() => deleteWarehouse(selectedWarehouse!)}
/>
