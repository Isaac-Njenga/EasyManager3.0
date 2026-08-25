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

	import { warehouseColumns } from '$lib/components/modules/warehouses/warehouse.columns';
	import type { Warehouse } from '$lib/types/warehouse.types';
	// import WarehousesDetails from '../../../../routes/(app)/warehouses/WarehouseDetails.svelte';
	import TransferForm from '$lib/components/modules/transfers/transfer.form.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { warehouseData as warehouses } from '$lib/data/warehouses.data';
	import { shopsData as shops } from '$lib/data/shop.data';
	import { transferStore } from '$lib/stores/transfer.svelte';

	type Props = {
		filteredWarehouses: Warehouse[];
	};

	let { filteredWarehouses }: Props = $props();

	// let isDrawerOpen = $state(false);
	let isTransferDrawerOpen = $state(false);
	let isDeleteWarehouseOpen = $state(false);
	let selectedWarehouse = $state<Warehouse | null>(null);

	//TO DO: move this into a +page.ts
	// Map warehouses and shops into unified LocationOption format
	const allLocations = $derived([
		...warehouses.map((wh) => ({
			id: wh._id,
			name: wh.name,
			type: 'Warehouse' as const
		})),
		...shops.map((shop) => ({
			id: shop._id,
			name: shop.name,
			type: 'Shop' as const
		}))
	]);

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
		transferStore.sourceId = warehouse._id;
		isTransferDrawerOpen = true;
	}

	function executeTransferAction() {
		transferStore.handleTransfer(allLocations);
		if (transferStore.items.length === 0) {
			isTransferDrawerOpen = false;
		}
	}

	function deleteWarehouse(warehouse: Warehouse) {
		console.log('Delete warehouse:', warehouse._id);
		isDeleteWarehouseOpen = false;
		selectedWarehouse = null;
		// isDrawerOpen = false;
	}
</script>

{#snippet codeCell(value: unknown, warehouse: Warehouse)}
	<div class="w-full">
		<span class="font-mono text-xs font-medium text-foreground">
			{String(value ?? warehouse.warehouseCode ?? '')}
		</span>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet nameCell(value: unknown, warehouse: Warehouse)}
	<div class="w-full">
		<div class="truncate font-medium text-foreground">{warehouse.name}</div>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet locationCell(value: unknown, warehouse: Warehouse)}
	<div class="w-full">
		<div class="truncate font-medium text-foreground">
			{warehouse.address?.city ?? 'N/A'}
		</div>
		{#if warehouse.address?.building}
			<div class="truncate text-xs text-muted-foreground">
				{warehouse.address.building}
			</div>
		{/if}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet statusCell(value: unknown, warehouse: Warehouse)}
	{#if warehouse.status === 'Active'}
		<Badge
			variant="outline"
			class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
		>
			Active
		</Badge>
	{:else if warehouse.status === 'Full Capacity'}
		<Badge
			variant="outline"
			class="border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
		>
			Full Capacity
		</Badge>
	{:else if warehouse.status === 'Under Maintenance'}
		<Badge
			variant="outline"
			class="border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400"
		>
			Maintenance
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
{#snippet stockCell(value: unknown, warehouse: Warehouse)}
	<div class="flex flex-col">
		<span class="font-medium text-foreground">
			{(warehouse.inventorySummary?.totalItemsInStock ?? 0).toLocaleString()} units
		</span>
		<span class="text-xs text-muted-foreground">
			{warehouse.inventorySummary?.totalProducts ?? 0} SKUs
		</span>
	</div>
{/snippet}

<!-- Row Actions -->
<!-- eslint-disable-next-line -->
{#snippet actionsCell(_value: unknown, warehouse: Warehouse)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button variant="ghost" size="icon" class="size-8">
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewWarehouse(warehouse)}>View</DropdownMenuItem>
			<DropdownMenuItem onclick={() => editWarehouse(warehouse)}>Edit</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem onclick={() => transferStock(warehouse)}>Transfer</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => openDeleteModal(warehouse)}
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<!-- Data Table -->
<DataTable
	data={filteredWarehouses}
	columns={warehouseColumns}
	getRowKey={(Warehouse) => Warehouse._id}
	emptyMessage="No Warehouses recorded."
	cells={{ stockCell, locationCell, nameCell, codeCell, statusCell, actionsCell }}
	pagination
	pageSize={5}
	pageSizeOptions={[5, 10, 20, 50]}
/>

<Modal
	bind:open={isTransferDrawerOpen}
	title={selectedWarehouse?.name ?? 'Initiate Stock Transfer'}
	description={selectedWarehouse ? selectedWarehouse.warehouseCode : ''}
>
	{#if selectedWarehouse}
		<TransferForm locations={allLocations} preselectedSourceId={selectedWarehouse._id} />
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

<DeleteDialog
	bind:open={isDeleteWarehouseOpen}
	handleDelete={() => deleteWarehouse(selectedWarehouse!)}
/>
