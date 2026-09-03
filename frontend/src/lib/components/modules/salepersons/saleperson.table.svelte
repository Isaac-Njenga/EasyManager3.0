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
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	import { salespersonColumns } from '$lib/components/modules/salepersons/saleperson.column';
	import type { Salesperson } from '$lib/services/salesperson/salesperson.types';
	import SalespersonDetails from '../../../../routes/(app)/salepersons/[id]/+page.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { salespersonService } from '$lib/services/salesperson/salesperson.service';
	import { formatCurrency } from '$lib/utils';

	type Props = {
		filteredSalespersons: Salesperson[];
	};

	let { filteredSalespersons }: Props = $props();

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

	function getInitials(firstName: string, lastName: string): string {
		return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
	}
</script>

<!-- Name & Avatar snippet -->
<!-- eslint-disable-next-line -->
{#snippet nameCell(_value: unknown, salesperson: Salesperson)}
	<div class="flex items-center gap-3">
		<div
			class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
		>
			{getInitials(salesperson.firstName, salesperson.lastName)}
		</div>
		<div class="flex flex-col">
			<span class="leading-none font-medium">
				{salesperson.firstName}
				{salesperson.lastName}
			</span>
			<span class="mt-1 text-xs text-muted-foreground">
				ID: {salesperson._id.slice(-6)}
			</span>
		</div>
	</div>
{/snippet}

<!-- Assigned Shop Snippet -->
<!-- eslint-disable-next-line -->
{#snippet shopCell(_value: unknown, salesperson: Salesperson)}
	{#if salesperson.assignedShop}
		<div class="flex flex-col">
			<span class="text-xs font-medium">{salesperson.assignedShop.name}</span>
			<span class="text-[11px] text-muted-foreground">
				{salesperson.assignedShop.shopCode} ({salesperson.assignedShop.address.town})
			</span>
		</div>
	{:else}
		<span class="text-xs text-muted-foreground italic">Unassigned</span>
	{/if}
{/snippet}

<!-- Commission Snippet -->
<!-- eslint-disable-next-line -->
{#snippet commissionCell(_value: unknown, salesperson: Salesperson)}
	<span class="text-destructive">
    {formatCurrency(Number(salesperson.performanceSummary?.totalCommissionEarned ?? 0))}
	</span>
{/snippet}

<!-- Revenue Snippet -->
<!-- eslint-disable-next-line -->
{#snippet revenueCell(_value: unknown, salesperson: Salesperson)}
	<span class="text-emerald-500">
    {formatCurrency(Number(salesperson.performanceSummary?.totalRevenueGenerated ?? 0))}
	</span>
{/snippet}

<!-- Status Snippet -->
<!-- eslint-disable-next-line -->
{#snippet statusCell(_value: unknown, salesperson: Salesperson)}
	{#if salesperson.status === 'Active'}
		<Badge
			variant="outline"
			class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
		>
			Active
		</Badge>
	{:else if salesperson.status === 'Inactive'}
		<Badge
			variant="outline"
			class="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
		>
			Inactive
		</Badge>
	{:else}
		<Badge
			variant="outline"
			class="border-destructive/30 bg-destructive/10 text-destructive dark:text-rose-400"
		>
			Terminated
		</Badge>
	{/if}
{/snippet}

<!-- Actions Snippet -->
<!-- eslint-disable-next-line -->
{#snippet actionsCell(_value: unknown, salesperson: Salesperson)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button
				variant="ghost"
				size="icon"
				class="size-8"
				aria-label={`Actions for ${salesperson.firstName} ${salesperson.lastName}`}
			>
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewSalesperson(salesperson)}>View</DropdownMenuItem>
			<DropdownMenuItem onclick={() => editSalesperson(salesperson)}>Edit</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => openDeleteModal(salesperson)}
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<!-- Data Table -->
<DataTable
	data={filteredSalespersons}
	columns={salespersonColumns}
	getRowKey={(salesperson) => salesperson._id}
	emptyMessage="No salespersons found."
	cells={{
		nameCell,
		shopCell,
		commissionCell,revenueCell,
		statusCell,
		actionsCell
	}}
	pagination
	pageSize={10}
	pageSizeOptions={[10, 20, 50]}
/>

<!-- Reusable Salesperson Drawer -->
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
