<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Salesperson } from '$lib/services/salesperson/salesperson.types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import DataDrawer from '$lib/components/common/DataDrawer.svelte';

	import SalespersonDetails from '../../../../../routes/(app)/salepersons/[id]/+page.svelte';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import { invalidateAll } from '$app/navigation';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { salespersonService } from '$lib/services/salesperson/salesperson.service';
	import { toast } from 'svelte-sonner';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		salesperson
	}: {
		salesperson: Salesperson;
	} = $props();

	let isDrawerOpen = $state(false);
	let isDeleteSalespersonOpen = $state(false);
	let selectedSalesperson = $state<Salesperson | null>(null);

	function viewSalesperson(salesperson: Salesperson) {
		selectedSalesperson = salesperson;
		isDrawerOpen = true;
	}

	function editSalesperson(salesperson: Salesperson) {
		goto(resolve(`/salepersons/${salesperson._id}/edit`));
	}

	function openDeleteModal(salesperson: Salesperson) {
		selectedSalesperson = salesperson;
		isDeleteSalespersonOpen = true;
	}

	async function deleteSalesperson(salesperson: Salesperson) {
		try {
			await salespersonService.delete(getBrowserServiceContext(), salesperson._id);
			toast.success('Salesperson deleted');

			isDeleteSalespersonOpen = false;
			selectedSalesperson = null;
			await invalidateAll();
			isDrawerOpen = false;
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to delete salesperson.';
			toast.error('Sales member deletion failed', { description });
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
		<DropdownMenu.Item onclick={() => viewSalesperson(salesperson)}>View</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => editSalesperson(salesperson)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="text-destructive focus:text-destructive"
			onclick={() => openDeleteModal(salesperson)}
		>
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<DataDrawer
	bind:open={isDrawerOpen}
	title={selectedSalesperson
		? `${selectedSalesperson.firstName} ${selectedSalesperson.lastName}`
		: 'Salesperson Details'}
	description={selectedSalesperson?.assignedShop ? `${selectedSalesperson.assignedShop.name}` : ''}
	direction="right"
>
	{#if selectedSalesperson}
		<SalespersonDetails {selectedSalesperson} />
	{/if}

	{#snippet footer()}
		<div class="flex w-full flex-col gap-2">
			<div class="grid w-full grid-cols-2 gap-2">
				<Button href={`/salespersons/${selectedSalesperson?._id}/edit`} size="xs" class="w-full">
					Edit Salesperson
				</Button>
				<Button
					onclick={() => openDeleteModal(selectedSalesperson!)}
					size="xs"
					variant="destructive"
					class="w-full"
				>
					Delete Salesperson
				</Button>
			</div>

			<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'xs', class: 'w-full' })}>
				Close
			</Drawer.Close>
		</div>
	{/snippet}
</DataDrawer>

<DeleteDialog
	bind:open={isDeleteSalespersonOpen}
	handleDelete={() => deleteSalesperson(selectedSalesperson!)}
/>
