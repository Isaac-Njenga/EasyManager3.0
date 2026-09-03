<script lang="ts">
	import type { Expense } from '$lib/services/expenses/expense.types';

	import { Badge } from '$lib/components/ui/badge';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import Calendar from '@lucide/svelte/icons/calendar';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Tag from '@lucide/svelte/icons/tag';
	import { formatCurrency } from '$lib/utils';
	import { format } from 'date-fns';
	import LogFooter from '$lib/components/common/LogFooter.svelte';

	type Props = {
		selectedExpense: Expense | null;
	};

	//eslint-disable-next-line
	let { selectedExpense: expense }: Props = $props();

	const statusVariant = $derived(
		expense?.paymentStatus === 'Paid'
			? 'default'
			: expense?.paymentStatus === 'Pending'
				? 'secondary'
				: 'destructive'
	);
</script>

<div class=" space-y-6">
	<div class="rounded-xl border bg-card p-6 shadow-sm">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<Badge
						variant={statusVariant}
						class={expense?.paymentStatus === 'Paid'
							? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400'
							: ''}
					>
						{expense?.paymentStatus}
					</Badge>
				</div>
				<h1 class="text-lg font-bold tracking-tight text-foreground">{expense?.title}</h1>
				<p class="text-xs text-muted-foreground">
					Payee: <span class="font-medium text-foreground">{expense?.payee}</span>
				</p>
			</div>

			<!-- Total Big Stat -->
			<div class="rounded-lg bg-muted/50 p-2 text-left sm:text-right">
				<span class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
					Total Amount
				</span>
				<p class="text-xl font-bold text-red-500">
					{expense?.amount ? formatCurrency(expense.amount) : ''}
				</p>
			</div>
		</div>
	</div>

	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<h3
			class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
		>
			Overview
		</h3>
		<Separator />

		<div class="space-y-3 text-xs">
			<div class="flex items-center justify-between">
				<span class="flex items-center gap-2 text-muted-foreground">
					<Tag class="size-3.5" /> Category
				</span>
				<Badge variant="outline">{expense?.category}</Badge>
			</div>

			<div class="flex items-center justify-between">
				<span class="flex items-center gap-2 text-muted-foreground">
					<Calendar class="size-3.5" /> Expense Date
				</span>
				<span class="font-medium text-foreground"
					>{expense?.dateOfExpense ? format(new Date(expense.dateOfExpense), 'PPPP') : '—'}</span
				>
			</div>

			<div class="flex items-center justify-between">
				<span class="flex items-center gap-2 text-muted-foreground">
					<CreditCard class="size-3.5" /> Payment Method
				</span>
				<span class="font-medium text-foreground">{expense?.paymentMethod}</span>
			</div>
		</div>
	</div>

	<!-- Section 3: Notes / Remarks -->
	{#if expense?.notes}
		<div class="space-y-2 rounded-xl border bg-card p-5 shadow-sm">
			<h3 class="text-xs font-bold tracking-wider text-muted-foreground uppercase">
				Notes & Instructions
			</h3>
			<p
				class="rounded-md bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre-wrap text-foreground"
			>
				{expense?.notes}
			</p>
		</div>
	{/if}
	<LogFooter
		createTimestamp={expense?.createdAt ? expense.createdAt : new Date().toISOString()}
		updateTimestamp={expense?.updatedAt ? expense.updatedAt : new Date().toISOString()}
	/>
</div>
