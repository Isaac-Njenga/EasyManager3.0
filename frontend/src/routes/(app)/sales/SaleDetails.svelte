<script lang="ts">
	import type { Sale } from '$lib/types/sale.types';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import Calendar from '@lucide/svelte/icons/calendar';
	import Receipt from '@lucide/svelte/icons/receipt';
	import Package from '@lucide/svelte/icons/package';
	import { formatCurrency } from '$lib/utils';
	import { salespersonsData } from '$lib/data/saleperson.data';
	import { format } from 'date-fns';
	import LogFooter from '$lib/components/common/LogFooter.svelte';

	type Props = {
		selectedSale: Sale | null;
	};

	let { selectedSale }: Props = $props();

	function salespersonName(saleperson: Sale['saleperson']) {
		if (typeof saleperson !== 'string') return `${saleperson.firstName} ${saleperson.lastName}`;
		const person = salespersonsData.find((candidate) => candidate._id === saleperson);
		return person ? `${person.firstName} ${person.lastName}` : saleperson;
	}
</script>

{#if !selectedSale}
	<div
		class="flex h-64 flex-col items-center justify-center space-y-2 text-center text-muted-foreground"
	>
		<Receipt class="size-10 stroke-1" />
		<p class="text-sm">Select a sale to view detailed transaction records.</p>
	</div>
{:else}
	<div class="space-y-6 p-1 text-sm">
		<!-- Header Info Card -->
		<div class="flex items-start justify-between rounded-lg border bg-card p-4 shadow-sm">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="text-lg font-bold tracking-tight text-foreground">
						{selectedSale.receiptNumber}
					</span>
					<Separator orientation="vertical" />
					<Badge variant="outline" class="text-xs">
						{selectedSale.paymentMethod}
					</Badge>
				</div>
				<p class="flex items-center gap-1.5 text-xs text-muted-foreground">
					<Calendar class="size-3.5" />
					{format(new Date(selectedSale.dateOfSale), 'PPPP')}
				</p>
				<p class="text-xs text-muted-foreground">
					Salesperson: <span class="font-medium text-foreground"
						>{salespersonName(selectedSale.saleperson)}</span
					>
				</p>
			</div>

			<!-- Transaction Badges -->
			<div class="flex flex-col items-end gap-1.5">
				<Badge
					variant="secondary"
					class={selectedSale.paymentStatus === 'Paid'
						? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
						: selectedSale.paymentStatus === 'Partially Paid'
							? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
							: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'}
				>
					{selectedSale.paymentStatus}
				</Badge>
			</div>
		</div>

		<!-- Purchased Line Items -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<h4 class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					Items Sold ({selectedSale.items.length})
				</h4>
			</div>

			<div class="space-y-2.5">
				{#each selectedSale.items as item (item.productId)}
					<div class="flex items-start gap-3 rounded-lg border bg-card p-3 shadow-sm">
						<!-- Product Image / Placeholder -->
						{#if item.image && item.image.length > 0}
							<img
								src={item.image[0]}
								alt={item.productName}
								class="size-17 shrink-0 rounded-md border object-cover"
							/>
						{:else}
							<div
								class="flex size-14 shrink-0 items-center justify-center rounded-md border bg-muted"
							>
								<Package class="size-6 text-muted-foreground/60" />
							</div>
						{/if}

						<!-- Item Details -->
						<div class="flex-1 space-y-1">
							<div class="flex items-start justify-between gap-2">
								<h5 class="text-xs leading-snug font-semibold">{item.productName}</h5>
								<span class="font-semibold text-green-400">
									{formatCurrency(item.totalPrice)}
								</span>
							</div>

							<div class="flex flex-row justify-between gap-2">
								<div class="flex flex-col gap-2 text-[9px] text-muted-foreground">
									<span><strong class="font-medium text-foreground">Code:</strong> {item.code}</span
									>
									<span
										><strong class="font-medium text-foreground">Colour:</strong>
										{item.colour}</span
									>
								</div>

								<div class="flex items-center justify-between pt-1 text-xs">
									<span class="flex items-center gap-1 text-[10px] text-muted-foreground"> </span>
									<span class="text-muted-foreground">
										{item.quantity} × {formatCurrency(item.sellingPrice)}
										{#if item.discount > 0}
											<span class="font-medium text-rose-500"
												>(-{formatCurrency(item.discount)})</span
											>
										{/if}
									</span>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<Separator />

		<!-- Order Financial Summary -->
		<div class="space-y-2 rounded-lg border bg-muted/40 p-4">
			<div class="flex justify-between text-xs text-muted-foreground">
				<span>Subtotal</span>
				<span>{formatCurrency(selectedSale.subTotal)}</span>
			</div>

			{#if selectedSale.discountTotal > 0}
				<div class="flex justify-between text-xs text-rose-500">
					<span>Discount</span>
					<span>-{formatCurrency(selectedSale.discountTotal)}</span>
				</div>
			{/if}

			<Separator class="my-1" />

			<div class="flex justify-between text-base font-bold text-foreground">
				<span>Grand Total</span>
				<span class="text-green-500">{formatCurrency(selectedSale.grandTotal)}</span>
			</div>
		</div>

		<!-- Order Notes -->
		{#if selectedSale.notes}
			<div
				class="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200"
			>
				<span class="font-semibold">Note:</span>
				{selectedSale.notes}
			</div>
		{/if}

		<!-- Additional Actions -->
		<LogFooter createTimestamp={selectedSale.createdAt} updateTimestamp={selectedSale.updatedAt} />
	</div>
{/if}
