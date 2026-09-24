<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DataTable from '$lib/components/common/DataTable.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import PackageIcon from '@lucide/svelte/icons/package';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
	import type { Product } from '$lib/services/product/product.types';
	import type { Sale } from '$lib/services/sales/sales.types';
	import { SvelteMap } from 'svelte/reactivity';

	type Props = { products: Product[]; sales: Sale[] };

	// eslint-disable-next-line
	let { products, sales }: Props = $props();

	type ProductReportMetric = {
		productId: string;
		productName: string;
		sku: string;
		category: string;
		unitsSold: number;
		totalRevenue: number;
		profitMargin: number;
		currentStock: number;
		stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
	};

	const productReportMetrics = $derived(
		products.map((product) => {
			const sold = sales
				.flatMap((sale) => sale.items)
				.filter((item) => item.product._id === product._id);
			const unitsSold = sold.reduce((total, item) => total + item.quantity, 0);
			const totalRevenue = sold.reduce(
				(total, item) => total + (item.soldPrice ?? product.sellingPrice) * item.quantity,
				0
			);
			const profit = sold.reduce(
				(total, item) =>
					total + ((item.soldPrice ?? product.sellingPrice) - product.costPrice) * item.quantity,
				0
			);
			const currentStock = product.totalQuantity ?? 0;
			return {
				productId: product._id,
				productName: product.name,
				sku: product.sku ?? product.code,
				category: product.category,
				unitsSold,
				totalRevenue,
				profitMargin: totalRevenue ? Math.round((profit / totalRevenue) * 1000) / 10 : 0,
				currentStock,
				stockStatus:
					currentStock === 0 ? 'Out of Stock' : currentStock < 10 ? 'Low Stock' : 'In Stock'
			} satisfies ProductReportMetric;
		})
	);

	const categoryPerformance = $derived.by(() => {
		const totals = new SvelteMap<string, { revenue: number; itemsSold: number }>();
		for (const item of productReportMetrics) {
			const current = totals.get(item.category) ?? { revenue: 0, itemsSold: 0 };
			totals.set(item.category, {
				revenue: current.revenue + item.totalRevenue,
				itemsSold: current.itemsSold + item.unitsSold
			});
		}
		const totalRevenue = [...totals.values()].reduce((total, item) => total + item.revenue, 0);
		return [...totals.entries()]
			.map(([category, value]) => ({
				category,
				...value,
				percentage: totalRevenue ? Math.round((value.revenue / totalRevenue) * 1000) / 10 : 0
			}))
			.sort((a, b) => b.revenue - a.revenue);
	});

	let searchTerm = $state('');

	// Computed summary stats
	let totalRevenue = $derived(
		productReportMetrics.reduce((acc, curr) => acc + curr.totalRevenue, 0)
	);
	let totalUnitsSold = $derived(
		productReportMetrics.reduce((acc, curr) => acc + curr.unitsSold, 0)
	);
	let averageProfitMargin = $derived(
		productReportMetrics.length
			? Math.round(
					(productReportMetrics.reduce((acc, curr) => acc + curr.profitMargin, 0) /
						productReportMetrics.length) *
						10
				) / 10
			: 0
	);

	let filteredMetrics = $derived(
		productReportMetrics.filter((item) => {
			if (!searchTerm.trim()) return true;
			const term = searchTerm.toLowerCase();
			return (
				item.productName.toLowerCase().includes(term) ||
				item.sku.toLowerCase().includes(term) ||
				item.category.toLowerCase().includes(term)
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
		{ key: 'productName', header: 'Product & SKU', cell: 'productCell' },
		{ key: 'category', header: 'Category' },
		{ key: 'unitsSold', header: 'Units Sold', class: 'text-right' },
		{ key: 'totalRevenue', header: 'Revenue Generated', cell: 'revenueCell', class: 'text-right' },
		{ key: 'profitMargin', header: 'Margin', cell: 'marginCell', class: 'text-right' },
		{ key: 'stockStatus', header: 'Stock Status', cell: 'statusCell' }
	];
</script>

<!-- eslint-disable-next-line -->
{#snippet productCell(value: unknown, item: ProductReportMetric)}
	<div class="flex flex-col">
		<span class="font-medium text-foreground">{item.productName}</span>
		<span class="font-mono text-xs text-muted-foreground">{item.sku}</span>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet revenueCell(value: unknown, item: ProductReportMetric)}
	<div class="text-right font-medium text-foreground">
		{formatCurrency(item.totalRevenue)}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet marginCell(value: unknown, item: ProductReportMetric)}
	<div class="text-right font-semibold text-emerald-600">
		{item.profitMargin}%
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet statusCell(value: unknown, item: ProductReportMetric)}
	<Badge
		variant={item.stockStatus === 'In Stock'
			? 'outline'
			: item.stockStatus === 'Low Stock'
				? 'default'
				: 'destructive'}
	>
		{item.stockStatus} ({item.currentStock})
	</Badge>
{/snippet}

<div class="space-y-6">
	<!-- Summary Metrics -->
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Product Revenue</Card.Title>
				<DollarSignIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
				<p class="text-xs text-muted-foreground">Across {productReportMetrics.length} products</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Total Volume Sold</Card.Title>
				<PackageIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{totalUnitsSold.toLocaleString()} units</div>
				<p class="text-xs text-muted-foreground">Units recorded in completed sales</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-2">
				<Card.Title class="text-sm font-medium">Avg Profit Margin</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-emerald-600">{averageProfitMargin}%</div>
				<p class="text-xs text-muted-foreground">Weighted from product cost and sale price</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Category Sales Breakdown -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Category Revenue Breakdown</Card.Title>
			<Card.Description>Distribution of revenue across major product departments.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="space-y-4">
				{#each categoryPerformance as cat (cat.category)}
					<div class="space-y-1">
						<div class="flex items-center justify-between text-sm">
							<span class="font-medium text-foreground">{cat.category}</span>
							<span class="text-muted-foreground">
								{formatCurrency(cat.revenue)} ({cat.percentage}%)
							</span>
						</div>
						<div class="h-2 w-full rounded-full bg-muted">
							<div class="h-2 rounded-full bg-primary" style="width: {cat.percentage}%"></div>
						</div>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Product Analytics Table -->
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="flex items-center justify-between gap-4">
			<div class="w-full sm:w-80">
				<Search value={searchTerm} onChange={(val) => (searchTerm = val)} />
			</div>
			<span class="text-xs font-medium text-muted-foreground">
				Showing {filteredMetrics.length} of {productReportMetrics.length} items
			</span>
		</div>

		<DataTable
			data={filteredMetrics}
			{columns}
			getRowKey={(item) => item.productId}
			emptyMessage="No product metrics found."
			cells={{ productCell, revenueCell, marginCell, statusCell }}
			pagination
			pageSize={5}
		/>
	</div>
</div>
