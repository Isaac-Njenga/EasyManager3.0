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

	import { expenseColumns } from '$lib/components/modules/expenses/expenses.column';
	import ExpenseDetails from '../../../../routes/(app)/expenses/ExpenseDetails.svelte';
	import type { Expense } from '$lib/types/expense.types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { format } from 'date-fns';
	import { formatCurrency } from '$lib/utils';

	type Props = {
		filteredExpenses: Expense[];
	};

	let { filteredExpenses }: Props = $props();

	// 1. Reactive state variables using $state
	let isDrawerOpen = $state(false);
	let isDeleteExpenseOpen = $state(false);
	let selectedExpense = $state<Expense | null>(null);

	function viewExpense(expense: Expense) {
		selectedExpense = expense;
		isDrawerOpen = true;
	}

	function editExpense(expense: Expense) {
		goto(resolve(`/expenses/${expense._id}`));
	}

	function openDeleteModal(expense: Expense) {
		selectedExpense = expense;
		isDeleteExpenseOpen = true;
	}

	function deleteExpense(expense: Expense) {
		console.log('Delete Expense:', expense._id);
		isDeleteExpenseOpen = false;
		selectedExpense = null;
		isDrawerOpen = false;
	}
</script>

{#snippet categoryCell(_value: unknown, expense: Expense)}
	<div class="w-full">
		<div class="truncate font-medium">{expense.title}</div>
		<div class="truncate text-xs text-muted-foreground">
			{expense.category}
		</div>
	</div>
{/snippet}

{#snippet dateCell(_value: unknown, expense: Expense)}
	<div class="w-full">
		<p class="text-xs">{format(new Date(expense.dateOfExpense), 'EE dd, MMM yyyy')}</p>
	</div>
{/snippet}

{#snippet amountCell(_value: unknown, expense: Expense)}
	<div class="w-full">
		<p class="text-md text-red-500">{formatCurrency(expense.amount ?? '')}</p>
	</div>
{/snippet}

{#snippet statusCell(_value: unknown, expense: Expense)}
	{#if expense.paymentStatus === 'Paid'}
		<Badge
			variant="outline"
			class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
		>
			Paid
		</Badge>
	{:else if expense.paymentStatus === 'Cancelled'}
		<Badge
			variant="outline"
			class="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
		>
			Cancelled
		</Badge>
	{:else}
		<Badge
			variant="outline"
			class="border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400"
		>
			{expense.paymentStatus}
		</Badge>
	{/if}
{/snippet}

{#snippet actionsCell(_value: unknown, expense: Expense)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button variant="ghost" size="icon" class="size-8">
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewExpense(expense)}>View</DropdownMenuItem>
			<DropdownMenuItem onclick={() => editExpense(expense)}>Edit</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => openDeleteModal(expense)}
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<!-- Data Table -->
<DataTable
	data={filteredExpenses}
	columns={expenseColumns}
	getRowKey={(expense) => expense._id}
	emptyMessage="No Expenses found."
	cells={{
		categoryCell,
		dateCell,
		statusCell,
		amountCell,
		actionsCell
	}}
/>

<!-- Reusable Expense Drawer -->
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
				<Button href={`/expenses/${selectedExpense?._id}`} size="xs" class="w-full">
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
