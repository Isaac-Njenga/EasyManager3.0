<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { Card, CardContent } from '$lib/components/ui/card';
	import Wallet from '@lucide/svelte/icons/wallet';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Clock from '@lucide/svelte/icons/clock';
	import FileText from '@lucide/svelte/icons/file-text';
	import { formatCurrency } from '$lib/utils';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import DataTable from '$lib/components/modules/expenses/expense-table/expense.table.svelte';
	import { ExpenseColumns } from '$lib/components/modules/expenses/expense-table/expense.columns';

	let { data }: PageProps = $props();

	// Reactive derivations from server load
	const expenses = $derived(data.expenses ?? []);
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load expenses', { description: error });
		}
	});

	let isSearching = $state(false);

	let totalExpenseAmount = $derived(
		expenses.reduce(
			(sum, item) => (item.paymentStatus !== 'Cancelled' ? sum + item.amount : sum),
			0
		)
	);

	let totalPaidAmount = $derived(
		expenses
			.filter((item) => item.paymentStatus === 'Paid')
			.reduce((sum, item) => sum + item.amount, 0)
	);

	let totalPendingAmount = $derived(
		expenses
			.filter((item) => item.paymentStatus === 'Pending')
			.reduce((sum, item) => sum + item.amount, 0)
	);

	let totalRecordsCount = $derived(expenses.length);
</script>

<svelte:head>
	<title>Expenses | EasyManager</title>
</svelte:head>

<div class="space-y-6">
	<PageHeader
		title="Expenses"
		description="Manage and keep track of your expenses."
		actionLabel="Record An Expense"
		actionHref="/expenses/new"
	/>

	<!-- Analytics Metrics Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card>
			<CardContent class="flex items-center justify-between p-4">
				<div class="space-y-1">
					<p class="text-xs font-medium text-muted-foreground">Total Expenses</p>
					<p class="text-xl font-bold">{formatCurrency(totalExpenseAmount)}</p>
				</div>
				<div class="rounded-lg bg-primary/10 p-2 text-primary">
					<Wallet class="size-5" />
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="flex items-center justify-between p-4">
				<div class="space-y-1">
					<p class="text-xs font-medium text-muted-foreground">Paid Amount</p>
					<p class="text-xl font-bold text-red-600 dark:text-red-400">
						{formatCurrency(totalPaidAmount)}
					</p>
				</div>
				<div class="rounded-lg bg-red-500/10 p-2 text-red-600 dark:text-red-400">
					<CheckCircle2 class="size-5" />
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="flex items-center justify-between p-4">
				<div class="space-y-1">
					<p class="text-xs font-medium text-muted-foreground">Pending Amount</p>
					<p class="text-xl font-bold text-amber-600 dark:text-amber-400">
						{formatCurrency(totalPendingAmount)}
					</p>
				</div>
				<div class="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
					<Clock class="size-5" />
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="flex items-center justify-between p-4">
				<div class="space-y-1">
					<p class="text-xs font-medium text-muted-foreground">Total Transactions</p>
					<p class="text-xl font-bold">{totalRecordsCount}</p>
				</div>
				<div class="rounded-lg bg-muted p-2 text-muted-foreground">
					<FileText class="size-5" />
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Search & Filters -->
	<div class="space-y-4 rounded-xl border bg-card p-2 shadow-sm">
		<!-- Expenses Table Container -->
		<div>
			{#if isSearching}
				<div class="align-center flex flex-row items-center justify-center gap-4">
					<Loader2Icon class="animate-spin" />
					<div class="py-8 text-center text-muted-foreground">Loading expenses...</div>
				</div>
			{:else}
				<DataTable data={expenses} columns={ExpenseColumns} showSearch={true} />
			{/if}
		</div>
	</div>
</div>
