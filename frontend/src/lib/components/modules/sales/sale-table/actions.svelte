<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import DataDrawer from '$lib/components/common/DataDrawer.svelte';
	import type { Sale } from '$lib/services/sales/sales.types';
	import SalesDetails from '../../../../../routes/(app)/sales/[id]/+page.svelte';

	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import { invalidateAll } from '$app/navigation';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { saleService } from '$lib/services/sales/sales.service';

	import { toast } from 'svelte-sonner';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		sale
	}: {
		sale: Sale;
	} = $props();

	let isDrawerOpen = $state(false);
	let isDeleteSaleOpen = $state(false);
	let selectedSale = $state<Sale | null>(null);

	function viewSale(sale: Sale) {
		selectedSale = sale;
		isDrawerOpen = true;
	}

	function editSale(sale: Sale) {
		goto(resolve(`/sales/${sale._id}/edit`));
	}

	function openDeleteModal(sale: Sale) {
		selectedSale = sale;
		isDeleteSaleOpen = true;
	}

	async function deleteSale(sale: Sale) {
		try {
			await saleService.delete(getBrowserServiceContext(), sale._id);
			toast.success('Sale deleted');
			isDeleteSaleOpen = false;
			selectedSale = null;
			await invalidateAll();
			isDrawerOpen = false;
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to delete sale.';
			toast.error('Sale deletion failed', { description });
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
		<DropdownMenu.Item onclick={() => viewSale(sale)}>View</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => editSale(sale)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="text-destructive focus:text-destructive"
			onclick={() => openDeleteModal(sale)}
		>
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<DataDrawer
	bind:open={isDrawerOpen}
	title={selectedSale?.receiptNumber ?? 'Sale Details'}
	description={selectedSale
		? `Sale by ${selectedSale.saleperson.firstName} ${selectedSale.saleperson.lastName}`
		: ''}
	direction="right"
>
	{#if selectedSale}
		<SalesDetails {selectedSale} />
	{/if}
	{#snippet footer()}
		<div class="flex w-full flex-col gap-2">
			<div class="grid w-full grid-cols-2 gap-2">
				<Button href={`/sales/${selectedSale?._id}/edit`} size="xs" class="w-full">Edit Sale</Button
				>
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
