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

	import { formatCurrency, saleColumns } from '$lib/components/modules/sales/sales.columns';
	import type { Sale } from '$lib/types/sale.types';
	import SalesDetails from '../../../../routes/(app)/sales/SaleDetails.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { format } from 'date-fns';

	type Props = {
		filteredSales: Sale[];
	};

	let { filteredSales }: Props = $props();

	let isDrawerOpen = $state(false);
	let isDeleteSaleOpen = $state(false);
	let selectedSale = $state<Sale | null>(null);

	function viewSale(sale: Sale) {
		selectedSale = sale;
		isDrawerOpen = true;
	}

	function editSale(sale: Sale) {
		goto(resolve(`/sales/${sale._id}`));
	}

	function openDeleteModal(sale: Sale) {
		selectedSale = sale;
		isDeleteSaleOpen = true;
	}

	function deleteSale(sale: Sale) {
		console.log('Delete sale:', sale._id);
		isDeleteSaleOpen = false;
		selectedSale = null;
		isDrawerOpen = false;
	}
</script>

<!-- Receipt Number & Salesperson -->
{#snippet receiptCell(_value: unknown, sale: Sale)}
	<div class="w-full">
		<span class="font-semibold text-foreground">{sale.receiptNumber}</span>
		<p class="text-xs text-muted-foreground">{sale.saleperson}</p>
	</div>
{/snippet}

<!-- Items Overview (Shows total count & snapshot names) -->
{#snippet itemsCell(_value: unknown, sale: Sale)}
	<div class="w-full space-y-0.5">
		{#if sale.items.length > 0}
			<div class="truncate text-xs font-medium">
				{sale.items[0].productName}
			</div>
			{#if sale.items.length > 1}
				<p class="text-[11px] text-muted-foreground">
					+ {sale.items.length - 1} more item{sale.items.length - 1 > 1 ? 's' : ''}
				</p>
			{:else}
				<p class="text-[11px] text-muted-foreground">Qty: {sale.items[0].quantity}</p>
			{/if}
		{:else}
			<span class="text-xs text-muted-foreground">No items</span>
		{/if}
	</div>
{/snippet}

<!-- Customer Info -->
{#snippet customerCell(_value: unknown, sale: Sale)}
	<div class="w-full">
		<p class="truncate text-xs font-medium">{sale.customer?.name || 'Walk-in Customer'}</p>
		{#if sale.customer?.phone}
			<p class="text-[11px] text-muted-foreground">{sale.customer.phone}</p>
		{/if}
	</div>
{/snippet}

<!-- Payment Method -->
{#snippet paymentCell(_value: unknown, sale: Sale)}
	<div class="w-full">
		<Badge variant="outline" class="text-[11px] font-normal">
			{sale.paymentMethod}
		</Badge>
	</div>
{/snippet}

{#snippet totalCell(_value: unknown, sale: Sale)}
	<div class="w-full">
		<p class="font-normal text-green-400">
			{formatCurrency(sale.grandTotal)}
		</p>
	</div>
{/snippet}

{#snippet dateCell(_value: unknown, sale: Sale)}
	<div class="w-full">
		<p class="font-normal">{format(new Date(sale.dateOfSale), 'dd/MM/yyyy')}</p>
	</div>
{/snippet}

<!-- Transaction Status -->
{#snippet statusCell(_value: unknown, sale: Sale)}
	<div class="item-start flex flex-col gap-2">
		<div>
			{#if sale.paymentStatus === 'Paid'}
				<Badge
					variant="outline"
					class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
				>
					Paid
				</Badge>
			{:else if sale.paymentStatus === 'Pending'}
				<Badge
					variant="outline"
					class="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
				>
					Pending
				</Badge>
			
			{:else}
				<Badge variant="outline" class="border-green-200/30 bg-green-200/10 text-green-200">
					{sale.paymentStatus}
				</Badge>
			{/if}
		</div>
	</div>
{/snippet}

<!-- Row Actions -->
{#snippet actionsCell(_value: unknown, sale: Sale)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button
				variant="ghost"
				size="icon"
				class="size-8"
				aria-label={`Actions for ${sale.receiptNumber}`}
			>
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewSale(sale)}>View</DropdownMenuItem>
			<DropdownMenuItem onclick={() => editSale(sale)}>Edit</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => openDeleteModal(sale)}
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<!-- Data Table -->
<DataTable
	data={filteredSales}
	columns={saleColumns}
	getRowKey={(sale) => sale._id}
	emptyMessage="No sales recorded."
	cells={{
		receiptCell,
		itemsCell,
		customerCell,
		statusCell,
		actionsCell,
		totalCell,
		dateCell
	}}
/>

<!-- Drawer View -->
<DataDrawer
	bind:open={isDrawerOpen}
	title={selectedSale?.receiptNumber ?? 'Sale Details'}
	description={selectedSale ? `Sale by ${selectedSale.saleperson}` : ''}
	direction="right"
>
	{#if selectedSale}
		<SalesDetails {selectedSale} />
	{/if}
	{#snippet footer()}
		<div class="flex w-full flex-col gap-2">
			<div class="grid w-full grid-cols-2 gap-2">
				<Button href={`/sales/${selectedSale?._id}`} size="xs" class="w-full">Edit Sale</Button>
				<Button
					onclick={() => openDeleteModal(selectedSale!)}
					size="xs"
					variant="destructive"
					class="w-full"
				>
					Delete Sale
				</Button>
			</div>

			<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'xs', class: 'w-full' })}>
				Close
			</Drawer.Close>
		</div>
	{/snippet}
</DataDrawer>

<DeleteDialog bind:open={isDeleteSaleOpen} handleDelete={() => deleteSale(selectedSale!)} />
