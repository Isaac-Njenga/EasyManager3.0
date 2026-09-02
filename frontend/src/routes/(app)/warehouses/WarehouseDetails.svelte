<script lang="ts">
	import type { Warehouse } from '$lib/services/warehouse/warehouse.types';
	import { formatCurrency } from '$lib/utils';

	import { Badge } from '$lib/components/ui/badge';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import WarehouseIcon from '@lucide/svelte/icons/warehouse';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Package from '@lucide/svelte/icons/package';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import FileText from '@lucide/svelte/icons/file-text';
	import LogFooter from '$lib/components/common/LogFooter.svelte';

	type Props = {
		selectedWarehouse?: Warehouse | null;
	};

	let { selectedWarehouse }: Props = $props();

	// Derived status badge styling
	const statusBadgeClass = $derived.by(() => {
		switch (selectedWarehouse?.status) {
			case 'Active':
				return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
			case 'Full Capacity':
				return 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400';
			case 'Under Maintenance':
				return 'border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400';
			default:
				return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-500 dark:text-zinc-400';
		}
	});
</script>

{#if selectedWarehouse}
	<div class="space-y-6 p-1">
		<!-- Warehouse Header Card -->
		<div class="rounded-xl border bg-card p-5 shadow-sm">
			<div class="flex items-start justify-between gap-4">
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<Badge variant="outline" class={statusBadgeClass}>
							{selectedWarehouse.status}
						</Badge>
					</div>
					<h2 class="text-xl font-bold tracking-tight text-foreground">{selectedWarehouse.name}</h2>
					<p class="flex items-center gap-1.5 text-xs text-muted-foreground">
						<WarehouseIcon class="size-3.5 text-primary" /> Logistics & Storage Hub
					</p>
				</div>
			</div>
		</div>

		<!-- Stock Metrics Grid -->
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			<!-- Total Valuation -->
			<div class="rounded-lg border bg-card p-3 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<DollarSign class="size-3.5 text-emerald-500" /> Stock Value
				</div>
				<p class="mt-1 text-sm font-bold text-green-500">
					{formatCurrency(selectedWarehouse.inventorySummary?.totalStockValue ?? 0)}
				</p>
			</div>

			<!-- Total Items -->
			<div class="rounded-lg border bg-card p-3 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<Package class="size-3.5 text-blue-500" /> Total Units
				</div>
				<p class="mt-1 text-sm font-bold text-foreground">
					{(selectedWarehouse.inventorySummary?.totalItemsInStock ?? 0).toLocaleString()}
				</p>
			</div>

			<!-- Out of Stock / Low Stock -->
			<div class="rounded-lg border bg-card p-3 shadow-sm">
				<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
					<AlertTriangle class="size-3.5 text-amber-500" /> Stock Alerts
				</div>
				<div class="mt-1 flex items-baseline gap-2">
					<span
						class={`text-sm font-bold ${(selectedWarehouse.inventorySummary?.lowStockItemsCount ?? 0) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}
					>
						{selectedWarehouse.inventorySummary?.lowStockItemsCount ?? 0} Low
					</span>
					{#if (selectedWarehouse.inventorySummary?.outOfStockItemsCount ?? 0) > 0}
						<span class="text-xs text-destructive">
							({selectedWarehouse.inventorySummary?.outOfStockItemsCount} Out)
						</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Location Details -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<MapPin class="size-4 text-primary" /> Location & Address
			</h3>
			<Separator />

			<div class="space-y-3 text-xs">
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground">City/Town</span>
					<span class="font-medium text-foreground">{selectedWarehouse.address.city}</span>
				</div>

				<div class="flex items-start justify-between gap-4">
					<span class="text-muted-foreground">Building</span>
					<span class="text-right font-medium text-foreground">
						{selectedWarehouse.address.building || 'N/A'}
					</span>
				</div>
			</div>
		</div>

		<!-- Operational Remarks & Notes -->
		{#if selectedWarehouse.notes}
			<div class="space-y-2 rounded-xl border bg-card p-5 shadow-sm">
				<h3
					class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
				>
					<FileText class="size-4 text-primary" /> Notes
				</h3>
				<Separator />
				<p
					class="rounded-md bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre-wrap text-foreground"
				>
					{selectedWarehouse.notes}
				</p>
			</div>
		{/if}

		
		<LogFooter createTimestamp={selectedWarehouse.createdAt} updateTimestamp={selectedWarehouse.updatedAt} />
	</div>
{:else}
	<div class="py-12 text-center text-xs text-muted-foreground">
		No warehouse selected to display details.
	</div>
{/if}
