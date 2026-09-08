<script lang="ts">
	import {
		addDays,
		addMonths,
		addWeeks,
		endOfMonth,
		endOfWeek,
		format,
		startOfMonth,
		startOfWeek
	} from 'date-fns';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { LineChart } from 'layerchart';
	import { ChartContainer, ChartTooltip, type ChartConfig } from '$lib/components/ui/chart';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { Expense } from '$lib/services/expenses/expense.types';
	import type { Sale } from '$lib/services/sales/sales.types';

	type ChartView = 'week' | 'month';
	type ProgressionPoint = {
		date: Date;
		label: string;
		sales: number;
		expenses: number;
	};

	let { sales, expenses }: { sales: Sale[]; expenses: Expense[] } = $props();
	let chartView = $state<ChartView>('week');
	let chartPeriod = $state(new Date());

	const chartConfig = {
		sales: { label: 'Sales', color: '#10b981' },
		expenses: { label: 'Expenses', color: '#f43f5e' }
	} satisfies ChartConfig;

	function dateKey(date: Date) {
		return format(date, 'yyyy-MM-dd');
	}

	let chartRange = $derived(
		chartView === 'week'
			? {
					start: startOfWeek(chartPeriod, { weekStartsOn: 1 }),
					end: endOfWeek(chartPeriod, { weekStartsOn: 1 })
				}
			: { start: startOfMonth(chartPeriod), end: endOfMonth(chartPeriod) }
	);

	let chartData = $derived.by<ProgressionPoint[]>(() => {
		const points: ProgressionPoint[] = [];

		for (let date = chartRange.start; date <= chartRange.end; date = addDays(date, 1)) {
			const key = dateKey(date);
			points.push({
				date,
				label: format(date, chartView === 'week' ? 'EEE' : 'd'),
				sales: sales
					.filter(
						(sale) =>
							sale.dateOfSale === key &&
							(sale.status === 'Completed' || sale.status === 'Processing')
					)
					.reduce((total, sale) => total + sale.grandTotal, 0),
				expenses: expenses
					.filter(
						(expense) => expense.dateOfExpense === key && expense.paymentStatus !== 'Cancelled'
					)
					.reduce((total, expense) => total + expense.amount, 0)
			});
		}

		return points;
	});

	let periodLabel = $derived(
		chartView === 'week'
			? `${format(chartRange.start, 'MMM d')} - ${format(chartRange.end, 'MMM d, yyyy')}`
			: format(chartPeriod, 'MMMM yyyy')
	);

	function movePeriod(direction: number) {
		chartPeriod =
			chartView === 'week' ? addWeeks(chartPeriod, direction) : addMonths(chartPeriod, direction);
	}

	function setView(view: ChartView) {
		chartView = view;
		chartPeriod = new Date();
	}
</script>

<Card class="overflow-hidden">
	<CardHeader class="gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<CardTitle>Sales &amp; Expenses</CardTitle>
			<p class="mt-1 text-sm text-muted-foreground">Daily totals for the selected period</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<div class="flex rounded-lg border bg-muted/40 p-1" aria-label="Chart view">
				<button
					type="button"
					class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors {chartView === 'week'
						? 'bg-background text-foreground shadow-sm'
						: 'text-muted-foreground hover:text-foreground'}"
					onclick={() => setView('week')}
				>
					Weekly
				</button>
				<button
					type="button"
					class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors {chartView === 'month'
						? 'bg-background text-foreground shadow-sm'
						: 'text-muted-foreground hover:text-foreground'}"
					onclick={() => setView('month')}
				>
					Monthly
				</button>
			</div>
			<div class="flex items-center rounded-lg border">
				<button
					type="button"
					class="p-2 text-muted-foreground transition-colors hover:text-foreground"
					aria-label={`Previous ${chartView}`}
					onclick={() => movePeriod(-1)}
				>
					<ChevronLeftIcon class="size-4" />
				</button>
				<span class="min-w-32 px-1 text-center text-xs font-medium">{periodLabel}</span>
				<button
					type="button"
					class="p-2 text-muted-foreground transition-colors hover:text-foreground"
					aria-label={`Next ${chartView}`}
					onclick={() => movePeriod(1)}
				>
					<ChevronRightIcon class="size-4" />
				</button>
			</div>
		</div>
	</CardHeader>
	<CardContent>
		<div class="mb-4 flex items-center gap-5 text-xs font-medium">
			<span class="flex items-center gap-2"
				><span class="size-2.5 rounded-full bg-emerald-500"></span>Sales</span
			>
			<span class="flex items-center gap-2"
				><span class="size-2.5 rounded-full bg-rose-500"></span>Expenses</span
			>
		</div>
		<ChartContainer config={chartConfig} class="h-72 w-full p-4">
			<LineChart
				data={chartData}
				x="date"
				series={[
					{ key: 'sales', value: 'sales', color: 'var(--color-sales)' },
					{ key: 'expenses', value: 'expenses', color: 'var(--color-expenses)' }
				]}
				axis
				grid
				points
			>
				{#snippet tooltip()}
					<ChartTooltip labelKey="label" />
				{/snippet}
			</LineChart>
		</ChartContainer>
	</CardContent>
</Card>
