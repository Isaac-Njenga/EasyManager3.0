<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Expense } from '$lib/services/expenses/expense.types';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import DataDrawer from '$lib/components/common/DataDrawer.svelte';

	import ExpenseDetails from '../../../../../routes/(app)/expenses/[id]/+page.svelte';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import { invalidateAll } from '$app/navigation';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { expenseService } from '$lib/services/expenses/expense.service';

	import { toast } from 'svelte-sonner';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		expense
	}: {
		expense: Expense;
	} = $props();

	let isDrawerOpen = $state(false);
	let isDeleteExpenseOpen = $state(false);
	let selectedExpense = $state<Expense | null>(null);

	function viewExpense(expense: Expense) {
		selectedExpense = expense;
		isDrawerOpen = true;
	}

	function editExpense(expense: Expense) {
		goto(resolve(`/expenses/${expense._id}/edit`));
	}

	function openDeleteModal(expense: Expense) {
		selectedExpense = expense;
		isDeleteExpenseOpen = true;
	}

	async function deleteExpense(expense: Expense) {
		try {
			await expenseService.delete(getBrowserServiceContext(), expense._id);
			toast.success('Expense deleted');

			isDeleteExpenseOpen = false;
			selectedExpense = null;
			await invalidateAll();
			isDrawerOpen = false;
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to delete expense.';
			toast.error('Expense deletion failed', { description });
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
		<DropdownMenu.Item onclick={() => viewExpense(expense)}>View</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => editExpense(expense)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="text-destructive focus:text-destructive"
			onclick={() => openDeleteModal(expense)}
		>
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<DataDrawer
	bind:open={isDrawerOpen}
	title={selectedExpense?.title ?? 'Expense Details'}
	description={selectedExpense ? `${selectedExpense.expenseNumber}` : ''}
	direction="right"
>
	<ExpenseDetails {selectedExpense} />
	{#snippet footer()}
		<div class="flex w-full flex-col gap-2">
			<!-- Top row: Edit and Delete take 50% width each -->
			<div class="grid w-full grid-cols-2 gap-2">
				<Button href={`/expenses/${selectedExpense?._id}/edit`} size="xs" class="w-full">
					Edit Expense
				</Button>
				<Button
					onclick={() => openDeleteModal(selectedExpense!)}
					size="xs"
					variant="destructive"
					class="w-full"
				>
					Delete Expense
				</Button>
			</div>

			<!-- Bottom row: Close takes 100% width -->
			<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'xs', class: 'w-full' })}>
				Close
			</Drawer.Close>
		</div>
	{/snippet}
</DataDrawer>

<DeleteDialog
	bind:open={isDeleteExpenseOpen}
	handleDelete={() => deleteExpense(selectedExpense!)}
/>
