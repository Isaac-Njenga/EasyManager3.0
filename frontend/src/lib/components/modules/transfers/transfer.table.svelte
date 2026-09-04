<script lang="ts">
	import DataTable from '$lib/components/common/DataTable.svelte';

	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	import { transferColumns } from '$lib/components/modules/transfers/transfer.columns';
	import type {
		InventoryTransfer as Transfer,
		LocationEntity
	} from '$lib/services/transfers/transfer.types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { format } from 'date-fns';
	import type { Shop } from '$lib/services/shop/shop.types';
	import type { Warehouse } from '$lib/services/warehouse/warehouse.types';

	type Props = {
		filteredTransfers: Transfer[];
	};

	let { filteredTransfers }: Props = $props();

	$effect(() => {
		console.log(filteredTransfers);
	});

	let isDeleteTransferOpen = $state(false);
	// let isDrawerOpen = $state(false);
	let selectedTransfer = $state<Transfer | null>(null);

	function viewTransfer(transfer: Transfer) {
		selectedTransfer = transfer;
		goto(resolve(`/transfers/${transfer._id}`));
	}

	// function editTransfer(transfer: Transfer) {
	// 	goto(resolve(`/transfers/${transfer._id}/edit`));
	// }

	// function openDeleteModal(transfer: Transfer) {
	// 	selectedTransfer = transfer;
	// 	isDeleteTransferOpen = true;
	// }

	function deleteTransfer(transfer: Transfer) {
		console.log('Delete Transfer:', transfer._id);
		isDeleteTransferOpen = false;
		selectedTransfer = null;
		// isDrawerOpen = false;
	}

	// Type guard helpers
	export function isShop(entity: LocationEntity): entity is Shop {
		return 'name' in entity;
	}

	export function isWarehouse(entity: LocationEntity): entity is Warehouse {
		return 'name' in entity;
	}
</script>

{#snippet codeCell(value: unknown, transfer: Transfer)}
	<div class="w-full">
		<span class="font-mono text-xs font-medium text-foreground">
			{String(value ?? transfer.transferNumber ?? '')}
		</span>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet SourceCell(value: unknown, transfer: Transfer)}
	<div class="w-full">
		<div class="truncate font-medium text-foreground">
			{transfer.source.locationId.name}
		</div>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet DestinationCell(value: unknown, transfer: Transfer)}
	<div class="w-full">
		<div class="truncate font-medium text-foreground">
			{transfer.destination.locationId.name}
		</div>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet typeCell(value: unknown, transfer: Transfer)}
	<div class="w-full">
		{#if transfer.type === 'inter_warehouse'}
			<div class="truncate font-medium text-orange-400">Warehouse-Warehouse</div>
		{:else if transfer.type === 'return_to_hub'}
			<div class="truncate font-medium text-blue-400">Shop-Warehouse</div>
		{:else if transfer.type === 'store_replenishment'}
			<div class="truncate font-medium text-zinc-400">Warehouse-Shop</div>
		{:else}
			<div class="truncate font-medium text-yellow-400">Shop-Shop</div>
		{/if}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet itemsCountCell(value: unknown, transfer: Transfer)}
	<div>
		<span class="font-medium text-green-300">
			{transfer.totalItemsCount ?? 0}
		</span>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet dateCell(value: unknown, transfer: Transfer)}
	<div class="flex flex-col">
		<span class="font-medium text-foreground">
			{format(new Date(transfer.dateOfTransfer), 'dd/MM/yyyy')}
		</span>
	</div>
{/snippet}

<!-- Row Actions -->
<!-- eslint-disable-next-line -->
{#snippet actionsCell(_value: unknown, transfer: Transfer)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button variant="ghost" size="icon" class="size-8">
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewTransfer(transfer)}>View</DropdownMenuItem>
			<!-- <DropdownMenuItem onclick={() => editTransfer(transfer)}>Edit</DropdownMenuItem> -->
			<!-- <DropdownMenuSeparator />
			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => openDeleteModal(transfer)}
			>
				Delete
			</DropdownMenuItem> -->
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<!-- Data Table -->
<DataTable
	data={filteredTransfers}
	columns={transferColumns}
	getRowKey={(transfer) => transfer._id}
	emptyMessage="No Transfers recorded."
	cells={{ itemsCountCell, typeCell, DestinationCell, codeCell, dateCell, actionsCell, SourceCell }}
	pagination
	pageSize={10}
	pageSizeOptions={[5, 10, 20, 50]}
/>

<DeleteDialog
	bind:open={isDeleteTransferOpen}
	handleDelete={() => deleteTransfer(selectedTransfer!)}
/>
