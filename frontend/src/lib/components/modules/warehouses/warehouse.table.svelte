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

	import { warehouseColumns } from '$lib/components/modules/warehouses/warehouse.columns';
	import type { Warehouse } from '$lib/types/warehouse.types';
	import WarehousesDetails from '../../../../routes/(app)/warehouses/WarehouseDetails.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';

	type Props = {
		filteredWarehouses: Warehouse[];
	};

	let { filteredWarehouses }: Props = $props();

	let isDrawerOpen = $state(false);
	let isDeleteWarehouseOpen = $state(false);
	let selectedWarehouse = $state<Warehouse | null>(null);

	function viewWarehouse(warehouse: Warehouse) {
		selectedWarehouse = warehouse;
		isDrawerOpen = true;
	}

	function editWarehouse(warehouse: Warehouse) {
		goto(resolve(`/warehouses/${warehouse._id}`));
	}

	function openDeleteModal(warehouse: Warehouse) {
		selectedWarehouse = warehouse;
		isDeleteWarehouseOpen = true;
	}

	function deleteWarehouse(warehouse: Warehouse) {
		console.log('Delete warehouse:', warehouse._id);
		isDeleteWarehouseOpen = false;
		selectedWarehouse = null;
		isDrawerOpen = false;
	}
</script>

{#snippet codeCell(value: unknown, warehouse: Warehouse)}
	<div class="w-full">
		<span class="font-mono text-xs font-medium text-foreground">
			{String(value ?? warehouse.warehouseCode ?? '')}
		</span>
	</div>
{/snippet}

{#snippet nameCell(value: unknown, warehouse: Warehouse)}
	<div class="w-full">
		<div class="truncate font-medium text-foreground">{String(value ?? warehouse.name)}</div>
		
	</div>
{/snippet}

{#snippet locationCell(value: unknown, warehouse: Warehouse)}
	<div class="w-full">
		<div class="truncate font-medium text-foreground">{warehouse.address?.city ?? 'N/A'}</div>
		{#if warehouse.address?.building}
			<div class="truncate text-xs text-muted-foreground">
				{warehouse.address.building}
			</div>
		{/if}
	</div>
{/snippet}

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
/>

<!-- Drawer View -->
<DataDrawer
	bind:open={isDrawerOpen}
	title={selectedWarehouse?.name ?? 'Warehouse Details'}
	description={selectedWarehouse ? selectedWarehouse.warehouseCode : ''}
	direction="right"
>
	{#if selectedWarehouse}
		<WarehousesDetails {selectedWarehouse} />
	{/if}
	{#snippet footer()}
		<div class="flex w-full flex-col gap-2">
			<div class="grid w-full grid-cols-2 gap-2">
				<Button href={`/warehouses/${selectedWarehouse?._id}`} size="xs" class="w-full"
					>Edit Warehouse</Button
				>
				<Button
					onclick={() => openDeleteModal(selectedWarehouse!)}
					size="xs"
					variant="destructive"
					class="w-full"
				>
					Delete Warehouse
				</Button>
			</div>

			<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'xs', class: 'w-full' })}>
				Close
			</Drawer.Close>
		</div>
	{/snippet}
</DataDrawer>

<DeleteDialog
	bind:open={isDeleteWarehouseOpen}
	handleDelete={() => deleteWarehouse(selectedWarehouse!)}
/>
