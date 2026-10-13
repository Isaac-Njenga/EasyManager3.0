<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import ArrowLeftRightIcon from '@lucide/svelte/icons/arrow-left-right';
	import BoxesIcon from '@lucide/svelte/icons/boxes';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { matchesSearchQuery } from '$lib/utils';
	import { TransferColumns } from '$lib/components/modules/transfers/transfer-table/transfer.columns';
	import DataTable from '$lib/components/modules/transfers/transfer-table/transfer.table.svelte';

	const typeTags = [
		{ label: 'All', value: 'All' },
		{ label: 'Warehouse-Warehouse', value: 'inter_warehouse' },
		{ label: 'Shop-Warehouse', value: 'return_to_hub' },
		{ label: 'Warehouse-Shop', value: 'store_replenishment' },
		{ label: 'Shop-Shop', value: 'inter_shop' }
	];

	let { data }: PageProps = $props();
	const transfers = $derived(data.transfers ?? []);
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load transfers', { description: error });
		}
	});

	let searchTerm = $state('');
	let selectedType = $state('All');
	let isSearching = $state(false);

	let filteredTransfers = $derived(
		transfers.filter((item) => {
			const matchesType = selectedType === 'All' || item.type === selectedType;

			const matchesSearch = matchesSearchQuery(item, searchTerm);

			return matchesType && matchesSearch;
		})
	);

	// Derived Reporting Metrics
	let totalTransfers = $derived(filteredTransfers.length);

	let totalUnitsTransferred = $derived(
		filteredTransfers.reduce((acc, t) => acc + (t.totalItemsCount ?? 0), 0)
	);
</script>

<svelte:head>
	<title>Transfers | EasyManager</title>
</svelte:head>
<div class="space-y-6">
	<PageHeader
		title="Transfer Logs"
		description="View all previous stock transfers."
		// actionLabel="Initiate Stock Transfer"
		// actionHref="/transfers/new"
	/>

	<!-- Analytics Cards Grid -->
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
		<div class="rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-muted-foreground">Total Transfers</span>
				<ArrowLeftRightIcon class="size-4 text-orange-300" />
			</div>
			<div class="flex items-baseline gap-2">
				<span class="text-2xl font-bold tracking-tight text-orange-300">
					<div class="text-xl font-bold">{totalTransfers}</div>
					<p class="text-xs text-muted-foreground">
						{selectedType === 'All'
							? 'Across all transfer types'
							: `Filtered by ${typeTags.find((t) => t.value === selectedType)?.label}`}
					</p>
				</span>
			</div>
		</div>

		<div class="rounded-xl border bg-card p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-muted-foreground">Units Transferred</span>
				<BoxesIcon class="size-4 text-blue-300" />
			</div>
			<div class="flex items-baseline gap-2">
				<span class="text-2xl font-bold tracking-tight text-blue-300">
					<div class="text-xl font-bold">{totalUnitsTransferred.toLocaleString()}</div>
					<p class="text-xs text-muted-foreground">Total inventory items moved</p>
				</span>
			</div>
		</div>
	</div>

	<!-- Search & Filters -->
	<div class="space-y-4 rounded-xl border bg-card shadow-sm">
		<div>
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading Transfer Logs...</div>
				</div>
			{:else}
				<DataTable data={transfers} columns={TransferColumns} />
			{/if}
		</div>
	</div>
</div>
