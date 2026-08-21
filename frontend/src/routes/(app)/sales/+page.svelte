<script lang="ts">
	// import type { Sale } from '$lib/types/sale.types';
	import { SvelteDate } from 'svelte/reactivity';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Calendar from '@lucide/svelte/icons/calendar';
	import { formatCurrency } from '$lib/components/modules/sales/sales.columns';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { salesData } from '$lib/data/sales.data';
	import Search from '$lib/components/common/Search.svelte';
	import SalesTable from '$lib/components/modules/sales/sales.table.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	let searchTerm = $state('');

	let selectedStatus = $state('All');

	let isSearching = $state(false);
	// const statusTags = ['All', 'Active', 'Inactive'];

	// --- State ---
	// Default to current week's Monday
	let selectedWeekStart = $state(getMonday(new SvelteDate()));
	let selectedDayDateStr = $state<string | null>(null);

	// --- Helper Functions ---
	function getMonday(d: Date | SvelteDate) {
		const date = new SvelteDate(d);
		const day = date.getDay();
		const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
		date.setDate(diff);
		date.setHours(0, 0, 0, 0);
		return date;
	}

	function addDays(date: Date | SvelteDate, days: number) {
		const result = new SvelteDate(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	function formatDateKey(date: Date): string {
		return date.toISOString().split('T')[0];
	}

	// --- Derived Computations ---
	// Array of 7 days (Mon-Sun) for the selected week
	let weekDays = $derived(
		Array.from({ length: 7 }, (_, i) => {
			const dayDate = addDays(selectedWeekStart, i);
			const dateStr = formatDateKey(dayDate);
			const salesForDay = salesData.filter((s) => s.dateOfSale?.startsWith(dateStr));
			const totalRevenue = salesForDay.reduce((sum, s) => sum + (s.grandTotal || 0), 0);

			return {
				date: dayDate,
				dateStr,
				dayName: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
				displayDate: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
				salesCount: salesForDay.length,
				totalRevenue,
				sales: salesForDay
			};
		})
	);

	let totalWeeklyRevenue = $derived(weekDays.reduce((acc, d) => acc + d.totalRevenue, 0));
	let totalWeeklySalesCount = $derived(weekDays.reduce((acc, d) => acc + d.salesCount, 0));

	let activeDayData = $derived(weekDays.find((d) => d.dateStr === selectedDayDateStr) ?? null);

	// --- Week Navigation Actions ---
	function prevWeek() {
		selectedWeekStart = addDays(selectedWeekStart, -7);
		selectedDayDateStr = null;
	}

	function nextWeek() {
		selectedWeekStart = addDays(selectedWeekStart, 7);
		selectedDayDateStr = null;
	}

	function selectDay(dateStr: string) {
		selectedDayDateStr = selectedDayDateStr === dateStr ? null : dateStr;
	}

	let filteredSales = $derived(
		salesData.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));
			return matchesSearch && matchesStatus;
		})
	);
</script>

<div class="space-y-6">
	<PageHeader
		title="Sales"
		description="Manage sales and transactions."
		actionLabel="Record A Sale"
		actionHref="/sales/new"
	/>

	<div class="mb-3">
		<div class="mb-3">
			<Search
				value={searchTerm}
				bind:isLoading={isSearching}
				onChange={(val) => (searchTerm = val)}
			/>
		</div>
		<!-- <div class="flex gap-2">
			{#each statusTags as tag (tag)}
				<Badge
					variant={selectedStatus === tag ? 'default' : 'outline'}
					onclick={() => (selectedStatus = tag)}
					class="pointer-fine:cursor-pointer"
				>
					{tag}
				</Badge>
			{/each}
		</div> -->
	</div>

	<!-- 1. Week Controller & Summary Header -->
	<div
		class="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
	>
		<div class="flex items-center gap-2">
			<Calendar class="size-5 text-muted-foreground" />
			<div>
				<h2 class="text-sm font-semibold">
					{weekDays[0].displayDate} - {weekDays[6].displayDate}, {selectedWeekStart.getFullYear()}
				</h2>
				<p class="text-xs text-muted-foreground">
					Total Revenue: <span class="font-bold text-emerald-600"
						>{formatCurrency(totalWeeklyRevenue)}</span
					>
					| Total Sales: <span class="font-bold text-foreground">{totalWeeklySalesCount}</span>
				</p>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" onclick={prevWeek}>
				<ChevronLeft class="mr-1 size-4" /> Prev Week
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => (selectedWeekStart = getMonday(new Date()))}
			>
				This Week
			</Button>
			<Button variant="outline" size="sm" onclick={nextWeek}>
				Next Week <ChevronRight class="ml-1 size-4" />
			</Button>
		</div>
	</div>

	{#if isSearching}
		<div class="align-center flex flex-row items-center justify-center gap-4">
			<Loader2Icon class="animate-spin" />
			<div class="py-8 text-center text-muted-foreground">Loading sales...</div>
		</div>
	{:else}
		{#if searchTerm}
			<div class="mb-2 text-sm text-muted-foreground">
				Showing results for <b>"{searchTerm}"</b>
			</div>
			{#if filteredSales.length === 0}
				<p class="py-8 text-center text-xs text-muted-foreground">No sales found.</p>
			{:else}
				<SalesTable {filteredSales} />
			{/if}
		{/if}
	{/if}

	<!-- 2. Weekly Day Overview Grid (7 Days) -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
		{#each weekDays as day (day)}
			<button type="button" onclick={() => selectDay(day.dateStr)} class="text-left transition-all">
				<Card
					class={`cursor-pointer shadow-sm  hover:border-primary hover:shadow-md ${
						selectedDayDateStr === day.dateStr
							? 'border-primary bg-accent/40 ring-1 ring-primary'
							: ''
					}`}
				>
					<CardHeader class="px-3 py-1 pb-1">
						<CardTitle class="text-xs font-semibold text-muted-foreground">
							{day.dayName} <span class="text-[11px] font-normal">({day.displayDate})</span>
						</CardTitle>
					</CardHeader>
					<CardContent class="px-3 py-1 pt-1">
						<p class="text-sm font-bold text-foreground">
							{formatCurrency(day.totalRevenue)}
						</p>
						<p class="text-[11px] text-muted-foreground">
							{day.salesCount}
							{day.salesCount === 1 ? 'sale' : 'sales'}
						</p>
					</CardContent>
				</Card>
			</button>
		{/each}
	</div>

	<!-- 3. Drill-down Table for Selected Day -->
	{#if activeDayData}
		<div class="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between border-b pb-3">
				<div>
					<h3 class="text-sm font-bold">
						Sales for {activeDayData.dayName}, {activeDayData.displayDate}
					</h3>
					<p class="text-xs text-muted-foreground">
						{activeDayData.salesCount} transactions: Total {formatCurrency(
							activeDayData.totalRevenue
						)}
					</p>
				</div>
				<Button variant="ghost" size="sm" onclick={() => (selectedDayDateStr = null)}>Close</Button>
			</div>

			{#if activeDayData.sales.length === 0}
				<p class="py-8 text-center text-xs text-muted-foreground">No sales recorded on this day.</p>
			{:else}
				<div class="overflow-x-auto">
					<SalesTable filteredSales={activeDayData.sales} />
				</div>
			{/if}
		</div>
	{:else}
		<div class="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
			Click on any day above to expand and view individual transaction records.
		</div>
	{/if}
</div>
