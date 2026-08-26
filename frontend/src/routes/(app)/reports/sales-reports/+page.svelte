<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DataTable from '$lib/components/common/DataTable.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import ShoppingBagIcon from '@lucide/svelte/icons/shopping-bag';
	import BanknoteIcon from '@lucide/svelte/icons/banknote';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import {
		salesTransactions,
		paymentMethodBreakdown,
		type SalesTransaction
	} from '$lib/data/reports/sale-reports.data';

	let searchTerm = $state('');

	// Computed metrics
	let totalSalesRevenue = $derived(
		salesTransactions.reduce(
			(acc, curr) => acc + (curr.status !== 'Refunded' ? curr.totalAmount : 0),
			0
		)
	);
	let completedOrdersCount = $derived(
		salesTransactions.filter((s) => s.status === 'Completed').length
	);
	let avgOrderValue = $derived(
		completedOrdersCount > 0 ? Math.round(totalSalesRevenue / completedOrdersCount) : 0
	);

	let filteredTransactions = $derived(
		salesTransactions.filter((item) => {
			if (!searchTerm.trim()) return true;
			const term = searchTerm.toLowerCase();
			return (
				item.orderId.toLowerCase().includes(term) ||
				item.customerName.toLowerCase().includes(term) ||
				item.customerEmail.toLowerCase().includes(term) ||
				item.paymentMethod.toLowerCase().includes(term)
			);
		})
	);

	function formatCurrency(val: number) {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
			maximumFractionDigits: 0
		}).format(val);
	}

	const columns = [
		{ key: 'orderId', header: 'Order & Customer', cell: 'orderCustomerCell' },
		{ key: 'date', header: 'Date & Time' },
		{ key: 'paymentMethod', header: 'Payment' },
		{ key: 'totalAmount', header: 'Amount', cell: 'amountCell', class: 'text-right' },
		{ key: 'status', header: 'Status', cell: 'statusCell' }
	];
</script>

<!-- eslint-disable-next-line -->
{#snippet orderCustomerCell(value: unknown, item: SalesTransaction)}
	<div class="flex flex-col">
		<span class="font-medium text-foreground">{item.orderId}</span>
		<span class="text-xs text-muted-foreground">{item.customerName}</span>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet amountCell(value: unknown, item: SalesTransaction)}
	<div class="text-right font-semibold text-foreground">
		{formatCurrency(item.totalAmount)}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet statusCell(value: unknown, item: SalesTransaction)}
	<Badge
		variant={item.status === 'Completed'
			? 'outline'
			: item.status === 'Pending'
				? 'default'
				: 'destructive'}
	>
		{item.status}
	</Badge>
{/snippet}

<div class="space-y-6">
	<!-- Top KPI Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Total Sales Revenue</Card.Title>
				<BanknoteIcon class="size-4 text-emerald-600" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(totalSalesRevenue)}</div>
				<p class="text-xs text-muted-foreground">+18.5% compared to last period</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Completed Orders</Card.Title>
				<ShoppingBagIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{completedOrdersCount}</div>
				<p class="text-xs text-muted-foreground">583 orders across all channels</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Average Order Value</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(avgOrderValue)}</div>
				<p class="text-xs text-muted-foreground">+5.2% basket size increase</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Primary Method</Card.Title>
				<CreditCardIcon class="size-4 text-primary" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">M-PESA (64%)</div>
				<p class="text-xs text-muted-foreground">Highest volume payment gateway</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Sales Channel & Payment Method Distribution -->
	<div class="w-full">
		<!-- Payment Method Distribution -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Payment Method Distribution</Card.Title>
				<Card.Description>Share of orders processed by payment vendor.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					{#each paymentMethodBreakdown as pm (pm.method)}
						<div class="space-y-1">
							<div class="flex items-center justify-between text-sm">
								<span class="font-medium text-foreground">{pm.method}</span>
								<span class="text-muted-foreground">
									{pm.count} orders ({pm.percentage}%)
								</span>
							</div>
							<div class="h-2 w-full rounded-full bg-muted">
								<div class="h-2 rounded-full bg-emerald-500" style="width: {pm.percentage}%"></div>
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Recent Sales Data Table -->
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="flex items-center justify-between gap-4">
			<div class="w-full sm:w-80">
				<Search value={searchTerm} onChange={(val) => (searchTerm = val)} />
			</div>
			<span class="text-xs font-medium text-muted-foreground">
				Showing {filteredTransactions.length} of {salesTransactions.length} transactions
			</span>
		</div>

		<DataTable
			data={filteredTransactions}
			{columns}
			getRowKey={(item) => item.orderId}
			emptyMessage="No sales transactions found."
			cells={{ orderCustomerCell, amountCell, statusCell }}
			pagination
			pageSize={5}
		/>
	</div>
</div>
