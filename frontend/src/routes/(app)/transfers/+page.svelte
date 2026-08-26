<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import ArrowLeftRightIcon from '@lucide/svelte/icons/arrow-left-right';
	import BoxesIcon from '@lucide/svelte/icons/boxes';
	import TransferTable from '$lib/components/modules/transfers/transfer.table.svelte';
	import Search from '$lib/components/common/Search.svelte';

	import { transferData } from '$lib/data/transfer.data';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const typeTags = [
		{ label: 'All', value: 'All' },
		{ label: 'Warehouse-Warehouse', value: 'inter_warehouse' },
		{ label: 'Shop-Warehouse', value: 'return_to_hub' },
		{ label: 'Warehouse-Shop', value: 'store_replenishment' },
		{ label: 'Shop-Shop', value: 'inter_shop' }
	];

	let searchTerm = $state('');
	let selectedType = $state('All');
	let isSearching = $state(false);

	let filteredTransfers = $derived(
		transferData.filter((item) => {
			const matchesType = selectedType === 'All' || item.type === selectedType;

			const matchesSearch =
				!searchTerm.trim() ||
				item.transferNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.destination.name.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesType && matchesSearch;
		})
	);

	// Derived Reporting Metrics
	let totalTransfers = $derived(filteredTransfers.length);

	let totalUnitsTransferred = $derived(
		filteredTransfers.reduce((acc, t) => acc + (t.totalItemsCount ?? 0), 0)
	);
</script>

<div class="space-y-6">
	<PageHeader
		title="Transfer Logs"
		description="View all previous stock transfers."
		actionLabel="Initiate Stock Transfer"
		actionHref="/transfers/new"
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
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="space-y-3">
			<Search
				value={searchTerm}
				bind:isLoading={isSearching}
				onChange={(val) => (searchTerm = val)}
			/>

			<div class="flex items-center justify-between">
				<div class="flex gap-2">
					{#each typeTags as tag (tag.value)}
						<Badge
							variant={selectedType === tag.value ? 'default' : 'outline'}
							onclick={() => (selectedType = tag.value)}
							class="pointer-fine:cursor-pointer"
						>
							{tag.label}
						</Badge>
					{/each}
				</div>

				<span class="text-xs font-medium text-muted-foreground">
					Transfers: {filteredTransfers.length}
				</span>
			</div>
		</div>

		<!-- Table Container -->
		<div>
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading Transfer Logs...</div>
				</div>
			{:else}
				<Separator class="mb-4" />
				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b> ({filteredTransfers.length} found)
					</div>
				{/if}

				<TransferTable {filteredTransfers} />
			{/if}
		</div>
	</div>
</div>
