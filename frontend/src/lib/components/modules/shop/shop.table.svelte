<script lang="ts">
	import DataTable from '$lib/components/common/DataTable.svelte';
	import Modal from '$lib/components/common/Modal.svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	import { shopColumns } from '$lib/components/modules/shop/shop.columns';
	import type { Shop, ShopStatus, ShopType } from '$lib/services/shop/shop.types';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import TransferForm from '$lib/components/modules/transfers/transfer.form.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { transferStore } from '$lib/stores/transfer.svelte';
	import { shopService } from '$lib/services/shop/shop.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	type Props = {
		filteredShops: Shop[];
	};

	let { filteredShops }: Props = $props();

	let isTransferDrawerOpen = $state(false);
	let isDeleteShopOpen = $state(false);
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

	function executeTransferAction() {
		transferStore.handleTransfer();
		if (transferStore.items.length === 0) {
			isTransferDrawerOpen = false;
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

<!-- Custom Snippet Definitions using value parameter -->

{#snippet codeCell(value: unknown, shop: Shop)}
	<div class="w-full">
		<span class="font-mono text-xs font-medium text-foreground">
			{String(value ?? shop.shopCode ?? '')}
		</span>
	</div>
{/snippet}

{#snippet nameCell(value: unknown, shop: Shop)}
	<div class="w-full">
		<div class="truncate font-medium text-foreground">{String(value ?? shop.name)}</div>
		{#if shop.address?.building}
			<div class="truncate text-xs text-muted-foreground">
				{shop.address.building}
			</div>
		{/if}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet typeCell(value: unknown, _shop: Shop)}
	{@const type = (value as ShopType) ?? 'Retail Store'}
	<Badge variant={type === 'Showroom' ? 'secondary' : 'outline'}>
		{type}
	</Badge>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet statusCell(value: unknown, _shop: Shop)}
	{@const status = (value as ShopStatus) ?? 'Active'}
	{#if status === 'Active'}
		<Badge
			variant="outline"
			class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
		>
			Active
		</Badge>
	{:else if status === 'Under Maintenance'}
		<Badge
			variant="outline"
			class="border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400"
		>
			Under Maintenance
		</Badge>
	{:else}
		<Badge
			variant="outline"
			class="border-zinc-500/30 bg-zinc-500/10 text-zinc-500 dark:text-zinc-400"
		>
			Inactive
		</Badge>
	{/if}
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet stockCell(value: unknown, shop: Shop)}
	<div class="flex flex-col">
		<span class="font-medium text-foreground">
			{shop.inventorySummary?.totalItemsInStock.toLocaleString() ?? 0} units
		</span>
		<span class="text-xs text-muted-foreground">
			{shop.inventorySummary?.totalProducts ?? 0} items
		</span>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet actionsCell(_value: unknown, shop: Shop)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button variant="ghost" size="icon" class="size-8" aria-label={`Actions for ${shop.name}`}>
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewShop(shop)}>View</DropdownMenuItem>
			<DropdownMenuItem onclick={() => editShop(shop)}>Edit</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem onclick={() => transferStock(shop)}>Transfer</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => openDeleteModal(shop)}
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<!-- Data Table -->
<DataTable
	data={filteredShops}
	columns={shopColumns}
	getRowKey={(shop) => shop._id}
	emptyMessage="No Shops found."
	cells={{
		codeCell,
		nameCell,
		typeCell,
		statusCell,
		stockCell,
		actionsCell
	}}
	pagination
	pageSize={5}
	pageSizeOptions={[5, 10, 20, 50]}
/>

<Modal
	bind:open={isTransferDrawerOpen}
	title={selectedShop?.name ?? 'Initiate Stock Transfer'}
	description={selectedShop ? selectedShop.shopCode : ''}
>
	{#if selectedShop}
		<TransferForm preselectedSourceId={selectedShop._id} />
	{/if}
	{#snippet footer()}
		<div class="flex w-full flex-row items-center justify-end gap-2">
			<Button
				size="xs"
				variant="default"
				disabled={transferStore.items.length === 0}
				onclick={executeTransferAction}>Initiate Transfer</Button
			>
			<Dialog.Close class={buttonVariants({ variant: 'outline', size: 'xs' })}>Close</Dialog.Close>
		</div>
	{/snippet}
</Modal>

<DeleteDialog bind:open={isDeleteShopOpen} handleDelete={() => deleteShop(selectedShop!)} />
