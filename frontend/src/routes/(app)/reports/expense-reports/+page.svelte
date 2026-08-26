<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DataTable from '$lib/components/common/DataTable.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';
	import WalletIcon from '@lucide/svelte/icons/wallet';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import {
		expenseRecords,
		expenseCategoryBreakdown,
		type ExpenseRecord
	} from '$lib/data/reports/expense-reports.data';
	import { formatCurrency } from '$lib/utils';

	let searchTerm = $state('');

	// Computed summary stats
	let totalExpenses = $derived(
		expenseRecords.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.amount : 0), 0)
	);
	let pendingApprovalTotal = $derived(
		expenseRecords
			.filter((e) => e.status === 'Pending Approval')
			.reduce((acc, curr) => acc + curr.amount, 0)
	);
	let recurringTotal = $derived(
		expenseRecords
			.filter((e) => e.paymentType === 'Recurring')
			.reduce((acc, curr) => acc + curr.amount, 0)
	);

	let filteredExpenses = $derived(
		expenseRecords.filter((item) => {
			if (!searchTerm.trim()) return true;
			const term = searchTerm.toLowerCase();
			return (
				item.expenseId.toLowerCase().includes(term) ||
				item.description.toLowerCase().includes(term) ||
				item.vendor.toLowerCase().includes(term) ||
				item.category.toLowerCase().includes(term)
			);
		})
	);

	

	const columns = [
		{ key: 'expenseId', header: 'Expense ID & Details', cell: 'descriptionCell' },
		{ key: 'category', header: 'Category' },
		{ key: 'vendor', header: 'Vendor' },
		{ key: 'paymentType', header: 'Type', cell: 'typeCell' },
		{ key: 'amount', header: 'Amount', cell: 'amountCell', class: 'text-right' },
		{ key: 'status', header: 'Status', cell: 'statusCell' }
	];
</script>

<div>expenses</div>

<!-- eslint-disable-next-line -->
{#snippet descriptionCell(value: unknown, item: ExpenseRecord)}
	<div class="flex flex-col">
		<span class="font-medium text-foreground">{item.description}</span>
		<span class="font-mono text-xs text-muted-foreground">{item.expenseId} · {item.date}</span>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet typeCell(value: unknown, item: ExpenseRecord)}
	<Badge variant="outline" class="text-xs">
		{item.paymentType}
	</Badge>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet amountCell(value: unknown, item: ExpenseRecord)}
	<div class="text-right font-semibold text-foreground">
		{formatCurrency(item.amount)}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet statusCell(value: unknown, item: ExpenseRecord)}
	<Badge
		variant={item.status === 'Paid'
			? 'outline'
			: item.status === 'Pending Approval'
				? 'default'
				: 'destructive'}
	>
		{item.status}
	</Badge>
{/snippet}

<div class="space-y-6">
	<!-- Top Summary KPI Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Total Operational Costs</Card.Title>
				<WalletIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
				<p class="text-xs text-muted-foreground">-3.4% compared to last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Fixed Recurring Costs</Card.Title>
				<RefreshCwIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(recurringTotal)}</div>
				<p class="text-xs text-muted-foreground">Rent, subscriptions, utility baseline</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Pending Approvals</Card.Title>
				<ClockIcon class="size-4 text-amber-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-amber-600">{formatCurrency(pendingApprovalTotal)}</div>
				<p class="text-xs text-muted-foreground">Requires manager sign-off</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Recorded Vouchers</Card.Title>
				<ReceiptIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{expenseRecords.length} Items</div>
				<p class="text-xs text-muted-foreground">For current billing period</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Expense Category Breakdown -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Expenditure by Category</Card.Title>
			<Card.Description
				>Distribution of operational expenses across functional areas.</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="space-y-4">
				{#each expenseCategoryBreakdown as item (item.category)}
					<div class="space-y-1">
						<div class="flex items-center justify-between text-sm">
							<span class="font-medium text-foreground">{item.category}</span>
							<span class="text-muted-foreground">
								{formatCurrency(item.amount)} ({item.percentage}%)
							</span>
						</div>
						<div class="h-2 w-full rounded-full bg-muted">
							<div class="h-2 rounded-full bg-rose-500" style="width: {item.percentage}%"></div>
						</div>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Expense Records Data Table -->
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="flex items-center justify-between gap-4">
			<div class="w-full sm:w-80">
				<Search value={searchTerm} onChange={(val) => (searchTerm = val)} />
			</div>
			<span class="text-xs font-medium text-muted-foreground">
				Showing {filteredExpenses.length} of {expenseRecords.length} records
			</span>
		</div>

		<DataTable
			data={filteredExpenses}
			{columns}
			getRowKey={(item) => item.expenseId}
			emptyMessage="No expense records found."
			cells={{ descriptionCell, typeCell, amountCell, statusCell }}
			pagination
			pageSize={5}
		/>
	</div>
</div>
