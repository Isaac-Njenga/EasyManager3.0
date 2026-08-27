<script lang="ts">
	import type { Salesperson } from '$lib/types/salesperson.types';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { formatCurrency } from '$lib/utils';

	import Building2 from '@lucide/svelte/icons/building-2';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Wallet from '@lucide/svelte/icons/wallet';
	import Store from '@lucide/svelte/icons/store';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import LogFooter from '$lib/components/common/LogFooter.svelte';

	type Props = {
		selectedSalesperson: Salesperson | null;
	};

	let { selectedSalesperson }: Props = $props();

	function getInitials(firstName?: string, lastName?: string): string {
		return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
	}

	function formatDate(dateStr?: string): string {
		if (!dateStr) return 'N/A';
		return new Date(dateStr).toLocaleDateString('en-KE', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

{#if selectedSalesperson}
	<div class="space-y-6 py-2">
		<!-- Header Profile Card -->
		<div class="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
			<div
				class="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary"
			>
				{getInitials(selectedSalesperson.firstName, selectedSalesperson.lastName)}
			</div>

			<div class="min-w-0 flex-1">
				<div class="flex items-center justify-between gap-2">
					<h3 class="truncate text-base font-semibold text-foreground">
						{selectedSalesperson.firstName}
						{selectedSalesperson.lastName}
					</h3>
					{#if selectedSalesperson.status === 'Active'}
						<Badge
							variant="outline"
							class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
						>
							Active
						</Badge>
					{:else if selectedSalesperson.status === 'Inactive'}
						<Badge
							variant="outline"
							class="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
						>
							Inactive
						</Badge>
					{:else}
						<Badge
							variant="outline"
							class="border-destructive/30 bg-destructive/10 text-destructive dark:text-rose-400"
						>
							Terminated
						</Badge>
					{/if}
				</div>
				<p class="mt-1 truncate text-xs text-muted-foreground">
					ID: {selectedSalesperson._id}
				</p>
			</div>
		</div>

		<!-- Key Metrics Cards -->
		<div class="grid grid-cols-2 gap-3">
			<div class="rounded-lg border bg-card p-3 shadow-sm">
				<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
					<Wallet class="size-3.5 text-primary" />
					<span>Total Commission</span>
				</div>
				<p class="mt-2 text-lg font-bold text-red-400">
					{formatCurrency(selectedSalesperson.totalCommission ?? 0)}
				</p>
			</div>

			<div class="rounded-lg border bg-card p-3 shadow-sm">
				<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
					<Calendar class="size-3.5 text-primary" />
					<span>Total Revenue</span>
				</div>
				<p class="mt-2 text-lg font-semibold text-green-500">
					{formatDate(selectedSalesperson.hireDate)}
				</p>
			</div>
		</div>

		<Separator />

		<!-- Assigned Shop Details -->
		<div class="space-y-3">
			<h4 class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
				Assigned Branch & Shop
			</h4>

			{#if selectedSalesperson.assignedShop}
				<div class="space-y-2 rounded-lg border bg-muted/30 p-3">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2 text-sm font-medium text-foreground">
							<Store class="size-4 text-primary" />
							<span>{selectedSalesperson.assignedShop.name}</span>
						</div>
						<Badge variant="secondary" class="text-[10px]">
							{selectedSalesperson.assignedShop.type}
						</Badge>
					</div>

					<div class="grid grid-cols-2 gap-2 pt-1 text-xs text-muted-foreground">
						<div class="flex items-center gap-1.5">
							<Building2 class="size-3.5" />
							<span>{selectedSalesperson.assignedShop.shopCode}</span>
						</div>
						<div class="flex items-center gap-1.5">
							<MapPin class="size-3.5" />
							<span>{selectedSalesperson.assignedShop.address.town}</span>
						</div>
					</div>
				</div>
			{:else}
				<div class="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
					No shop currently assigned to this salesperson.
				</div>
			{/if}
		</div>

		<Separator />

		<!-- Record Metadata -->

		<LogFooter
			createTimestamp={selectedSalesperson.createdAt}
			updateTimestamp={selectedSalesperson.updatedAt}
		/>
	</div>
{:else}
	<div class="flex h-40 items-center justify-center text-xs text-muted-foreground">
		No salesperson selected.
	</div>
{/if}
