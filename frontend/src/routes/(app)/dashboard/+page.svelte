<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Input } from '$lib/components/ui/input';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
	import TrendingDownIcon from '@lucide/svelte/icons/trending-down';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import AwardIcon from '@lucide/svelte/icons/award';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	let selectedTag = $state('Today');
	let customDate = $state('');

	const dateTags = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 Days'];

	// Dynamic label for current scope
	let activeFilterLabel = $derived(
		customDate ? `Custom Date: ${customDate}` : `Showing metrics for: ${selectedTag}`
	);

	function selectTag(tag: string) {
		selectedTag = tag;
		customDate = ''; // Clear explicit date picker override
	}

	function handleCustomDate(e: Event) {
		const input = e.target as HTMLInputElement;
		customDate = input.value;
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Dashboard"
		description="Overview of revenue, expenses, and operational performance."
	/>

	<!-- Control Bar: Date Range Selectors -->
	<div
		class="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
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
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card class="transition-all hover:shadow-md">
			<CardHeader class="flex flex-row items-center justify-between pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
				<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
					<DollarSignIcon class="size-4" />
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">KES 0.00</div>
				<div class="mt-1 flex items-center text-xs text-emerald-600">
					<TrendingUpIcon class="mr-1 size-3" />
					<span>0.0% vs previous period</span>
				</div>
			</CardContent>
		</Card>

		<Card class="transition-all hover:shadow-md">
			<CardHeader class="flex flex-row items-center justify-between pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
				<div class="rounded-lg bg-rose-500/10 p-2 text-rose-600">
					<TrendingDownIcon class="size-4" />
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">KES 0.00</div>
				<div class="mt-1 flex items-center text-xs text-muted-foreground">
					<span>0 records logged</span>
				</div>
			</CardContent>
		</Card>

		<Card class="transition-all hover:shadow-md">
			<CardHeader class="flex flex-row items-center justify-between pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Commissions Paid</CardTitle>
				<div class="rounded-lg bg-amber-500/10 p-2 text-amber-600">
					<AwardIcon class="size-4" />
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">KES 0.00</div>
				<div class="mt-1 flex items-center text-xs text-muted-foreground">
					<span>0 salepersons payouts</span>
				</div>
			</CardContent>
		</Card>

		<Card class="transition-all hover:shadow-md">
			<CardHeader class="flex flex-row items-center justify-between pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
				<div class="rounded-lg bg-primary/10 p-2 text-primary">
					<TrendingUpIcon class="size-4" />
				</div>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">KES 0.00</div>
				<div class="mt-1 flex items-center text-xs text-muted-foreground">
					<span>Margin: 0.0%</span>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Main Detail Tabs -->
	<div class="rounded-xl border bg-card p-6 shadow-sm">
		<Tabs.Root value="sales" class="w-full">
			<Tabs.List class="grid w-full max-w-80 grid-cols-2">
				<Tabs.Trigger value="sales">Sales Analytics</Tabs.Trigger>
				<Tabs.Trigger value="expenses">Expense Log</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="sales" class="mt-6">
				<div
					class="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"
				>
					Sales breakdown and transaction tables go here.
				</div>
			</Tabs.Content>

			<Tabs.Content value="expenses" class="mt-6">
				<div
					class="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"
				>
					Operational expenses and voucher logs go here.
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
