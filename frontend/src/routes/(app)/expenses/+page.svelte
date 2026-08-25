<script lang="ts">
	import Search from '$lib/components/common/Search.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { expensesData as expenses } from '$lib/data/expenses.data';
	import ExpenseTable from '$lib/components/modules/expenses/expenses.table.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import Wallet from '@lucide/svelte/icons/wallet';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Clock from '@lucide/svelte/icons/clock';
	import FileText from '@lucide/svelte/icons/file-text';
	import { formatCurrency } from '$lib/utils';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let searchTerm = $state('');
	let selectedStatus = $state('All');
	let isSearching = $state(false);

	const statusTags = ['All', 'Paid', 'Pending', 'Cancelled'];

	// Analytics calculations using $derived
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

	let filteredExpenses = $derived(
		expenses.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();
			const matchesStatus = selectedStatus === 'All' || item.paymentStatus === selectedStatus;
			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));
			return matchesSearch && matchesStatus;
		})
	);
</script>

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
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="mb-3">
			<div class="mb-3">
				<Search
					value={searchTerm}
					bind:isLoading={isSearching}
					onChange={(val) => (searchTerm = val)}
				/>
			</div>
			<div class="flex items-center justify-between">
				<div class="flex gap-2">
					{#each statusTags as tag (tag)}
						<Badge
							variant={selectedStatus === tag ? 'default' : 'outline'}
							onclick={() => (selectedStatus = tag)}
							class="pointer-fine:cursor-pointer"
						>
							{tag}
						</Badge>
					{/each}
				</div>

				<span class="text-xs font-medium text-muted-foreground">
					Expenses: {filteredExpenses.length} 
				</span>
			</div>
		</div>

		<!-- Expenses Table Container -->
		<div>
			{#if isSearching}
				<div class="align-center flex flex-row items-center justify-center gap-4">
					<Loader2Icon class="animate-spin" />
					<div class="py-8 text-center text-muted-foreground">Loading expenses...</div>
				</div>
			{:else}
				<Separator class="mb-4" />
				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b>
					</div>
				{/if}
				<ExpenseTable {filteredExpenses} />
			{/if}
		</div>
	</div>
</div>
