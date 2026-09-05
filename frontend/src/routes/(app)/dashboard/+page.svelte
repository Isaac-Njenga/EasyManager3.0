<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Input } from '$lib/components/ui/input';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import SalesTable from '$lib/components/modules/sales/sales.table.svelte';
	import ExpensesTable from '$lib/components/modules/expenses/expenses.table.svelte';
	// import { salesData } from '$lib/data/sales.data';
	// import { expensesData } from '$lib/data/expenses.data';
	import { formatCurrency } from '$lib/utils';
	import { format, subDays } from 'date-fns';
	import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
	import TrendingDownIcon from '@lucide/svelte/icons/trending-down';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import AwardIcon from '@lucide/svelte/icons/award';
	import type { Sale } from '$lib/services/sales/sales.types';
	import type { Expense } from '$lib/services/expenses/expense.types';

	let selectedTag = $state('Today');
	let customDate = $state('');

	let salesData: Sale[] = [];
	let expensesData: Expense[] = [];

	const dateTags = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 Days'];

	// Dynamic label for current scope
	let activeFilterLabel = $derived(
		customDate
			? `Showing metrics for
		: ${customDate}`
			: `Showing metrics for: ${selectedTag}`
	);

	function selectTag(tag: string) {
		selectedTag = tag;
		customDate = ''; // Clear explicit date picker override
	}

	function handleCustomDate(e: Event) {
		const input = e.target as HTMLInputElement;
		customDate = input.value;
	}

	function dateKey(date: Date) {
		return format(date, 'yyyy-MM-dd');
	}

	function getRange() {
		if (customDate) return { start: customDate, end: customDate };

		let end = new Date();
		const days =
			selectedTag === 'Yesterday'
				? 1
				: selectedTag === 'Last 7 days'
					? 7
					: selectedTag === 'Last 30 Days'
						? 30
						: 1;

		if (selectedTag === 'Yesterday') {
			end = subDays(end, 1);
		}

		return { start: dateKey(subDays(end, days - 1)), end: dateKey(end) };
	}

	let range = $derived(getRange());
	let filteredSales = $derived(
		salesData.filter((sale) => sale.dateOfSale >= range.start && sale.dateOfSale <= range.end)
	);
	let filteredExpenses = $derived(
		expensesData.filter(
			(expense) => expense.dateOfExpense >= range.start && expense.dateOfExpense <= range.end
		)
	);
	let revenue = $derived(
		filteredSales
			.filter((sale) => sale.status === 'Completed' || sale.status === 'Processing')
			.reduce((total, sale) => total + sale.grandTotal, 0)
	);
	let expenses = $derived(
		filteredExpenses
			.filter((expense) => expense.paymentStatus !== 'Cancelled')
			.reduce((total, expense) => total + expense.amount, 0)
	);
	let costOfSales = $derived(
		filteredSales
			.filter((sale) => sale.status === 'Completed' || sale.status === 'Processing')
			.reduce(
				(total, sale) =>
					total +
					sale.items.reduce((itemTotal, item) => itemTotal + item.costPrice * item.quantity, 0),
				0
			)
	);
	let netProfit = $derived(revenue - costOfSales - expenses);
	let profitMargin = $derived(revenue ? (netProfit / revenue) * 100 : 0);
</script>

<div class="space-y-6">
	<PageHeader
		title="Dashboard"
		description="Overview of revenue, expenses, and operational performance."
	/>

	<!-- Control Bar: Date Range Selectors -->
	<div
		class="flex flex-col gap-4 rounded-xl border bg-card p-2 shadow-sm sm:flex-row sm:items-center sm:justify-between"
	>
		<div class="flex flex-wrap items-center gap-2">
			{#each dateTags as tag (tag)}
				<Badge
					variant={selectedTag === tag && !customDate ? 'default' : 'outline'}
					onclick={() => selectTag(tag)}
					class="cursor-pointer transition-colors"
				>
					{tag}
				</Badge>
			{/each}
		</div>

		<div class="flex items-center gap-2">
			<Input
				id="date-select"
				type="date"
				value={customDate}
				onchange={handleCustomDate}
				class="h-9 w-full text-xs sm:w-auto"
			/>
		</div>
	</div>

	<p class="text-xs font-medium text-muted-foreground">{activeFilterLabel}</p>

	<!-- Top KPI Grid -->
	<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
		<Card class="transition-all hover:shadow-md">
			<CardHeader class="flex flex-row items-center justify-between ">
				<CardTitle class="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
				<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
					<DollarSignIcon class="size-4" />
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-emerald-600">{formatCurrency(revenue)}</div>
				<div class="mt-1 flex items-center text-xs text-muted-foreground">
					<TrendingUpIcon class="mr-1 size-3" />
					<span>{filteredSales.length} recorded sale{filteredSales.length === 1 ? '' : 's'}</span>
				</div>
			</CardContent>
		</Card>

		<Card class="transition-all hover:shadow-md">
			<CardHeader class="flex flex-row items-center justify-between ">
				<CardTitle class="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
				<div class="rounded-lg bg-rose-500/10 p-2 text-rose-600">
					<TrendingDownIcon class="size-4" />
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-rose-600">{formatCurrency(expenses)}</div>
				<div class="mt-1 flex items-center text-xs text-muted-foreground">
					<span
						>{filteredExpenses.length} record{filteredExpenses.length === 1 ? '' : 's'} logged</span
					>
				</div>
			</CardContent>
		</Card>

		<Card class="transition-all hover:shadow-md">
			<CardHeader class="flex flex-row items-center justify-between ">
				<CardTitle class="text-sm font-medium text-muted-foreground">Commissions Paid</CardTitle>
				<div class="rounded-lg bg-amber-500/10 p-2 text-amber-600">
					<AwardIcon class="size-4" />
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-amber-600">KES 0.00</div>
				<div class="mt-1 flex items-center text-xs text-muted-foreground">
					<span>0 salepersons payouts</span>
				</div>
			</CardContent>
		</Card>

		<Card class="transition-all hover:shadow-md">
			<CardHeader class="flex flex-row items-center justify-between ">
				<CardTitle class="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
				<div class="rounded-lg bg-primary/10 p-2 text-blue-400">
					<TrendingUpIcon class="size-4" />
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-blue-400">{formatCurrency(netProfit)}</div>
				<div class="mt-1 flex items-center text-xs text-muted-foreground">
					<span>Margin: {profitMargin.toFixed(1)}%</span>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Main Detail Tabs -->
	<div class="rounded-xl border bg-card p-4 shadow-sm">
		<Tabs.Root value="sales" class="w-full">
			<Tabs.List class="grid w-full max-w-80 grid-cols-2">
				<Tabs.Trigger value="sales">Sales Analytics</Tabs.Trigger>
				<Tabs.Trigger value="expenses">Expense Log</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="sales" class="mt-2">
				<SalesTable {filteredSales} />
			</Tabs.Content>

			<Tabs.Content value="expenses" class="mt-6">
				<ExpensesTable {filteredExpenses} />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
