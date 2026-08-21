<script lang="ts">
	import type {
		Expense,
		ExpenseCategory,
		PaymentMethod,
		ExpenseStatus
	} from '$lib/types/expense.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	import Tag from '@lucide/svelte/icons/tag';
	import FileText from '@lucide/svelte/icons/file-text';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import { toast } from 'svelte-sonner';

	type Props = {
		expense?: Expense;
	};

	let { expense }: Props = $props();

	// --- Select Options ---
	const categoryOptions: { value: ExpenseCategory; label: string }[] = [
		{ value: 'Rent & Utilities', label: 'Rent & Utilities' },
		{ value: 'Salaries & Wages', label: 'Salaries & Wages' },
		{ value: 'Inventory & Supplies', label: 'Inventory & Supplies' },
		{ value: 'Marketing & Ads', label: 'Marketing & Ads' },
		{ value: 'Transport & Logistics', label: 'Transport & Logistics' },
		{ value: 'Maintenance & Repairs', label: 'Maintenance & Repairs' },
		{ value: 'Licenses & Taxes', label: 'Licenses & Taxes' },
		{ value: 'Miscellaneous', label: 'Miscellaneous' }
	];

	const paymentOptions: { value: PaymentMethod; label: string }[] = [
		{ value: 'M-Pesa', label: 'M-Pesa' },
		{ value: 'Cash', label: 'Cash' },
		{ value: 'Bank Transfer', label: 'Bank Transfer' },
		{ value: 'Credit Card', label: 'Credit Card' }
	];

	const statusOptions: { value: ExpenseStatus; label: string }[] = [
		{ value: 'Paid', label: 'Paid' },
		{ value: 'Pending', label: 'Pending' },
		{ value: 'Cancelled', label: 'Cancelled' }
	];

	// --- Form State (Initialized with existing expense or defaults) ---
	let title = $state('');
	let payee = $state('');
	let category = $state<ExpenseCategory>('Rent & Utilities');
	let amount = $state<number | ''>('');
	let dateOfExpense = $state(new Date().toISOString().split('T')[0]);
	let paymentMethod = $state<PaymentMethod>('Cash');
	let paymentStatus = $state<ExpenseStatus>('Paid');
	let notes = $state('');

	$effect(() => {
		title = expense?.title ?? '';
		payee = expense?.payee ?? '';
		amount = expense?.amount ?? '';
		category = expense?.category ?? 'Rent & Utilities';
		paymentMethod = expense?.paymentMethod ?? 'Cash';
		paymentStatus = expense?.paymentStatus ?? 'Paid';
		dateOfExpense = expense?.dateOfExpense ?? new Date().toISOString().split('T')[0];
		notes = expense?.notes ?? '';
	});

	let isSubmitting = $state(false);

	// --- Derived Select Triggers ---
	const categoryTriggerContent = $derived(
		categoryOptions.find((c) => c.value === category)?.label ?? 'Select category'
	);

	const paymentTriggerContent = $derived(
		paymentOptions.find((p) => p.value === paymentMethod)?.label ?? 'Select method'
	);

	const statusTriggerContent = $derived(
		statusOptions.find((s) => s.value === paymentStatus)?.label ?? 'Select status'
	);

	// --- Form Submission ---
	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const requiredFields = [
			{ name: 'Title', value: title },
			// { name: 'Payee', value: payee },
			{ name: 'Category', value: category },
			{ name: 'Amount', value: amount },
			{ name: 'Date of Expense', value: dateOfExpense }
		];

		const missing = requiredFields.filter((f) => !f.value?.toString().trim());

		if (missing.length > 0) {
			toast.warning('Please fill in required fields', {
				description: `Missing: ${missing.map((m) => m.name).join(', ')}`
			});
			return;
		}

		if (Number(amount) <= 0) {
			toast.warning('Amount must be greater than zero');
			return;
		}

		isSubmitting = true;

		const payload: Partial<Expense> = {
			...expense,
			expenseNumber:
				expense?.expenseNumber ??
				`EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
			title: title.trim(),
			payee: payee.trim(),
			category,
			amount: Number(amount),
			dateOfExpense,
			paymentMethod,
			paymentStatus,
			notes: notes.trim() || undefined
		};

		console.log('Expense Saved:', payload);

		toast.success('Expense saved!');
		isSubmitting = false;
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<!-- Card 1: Core Expense Overview -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<Tag class="size-4 text-primary" /> Basic Details
			</h3>
			<Separator />

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- Title -->
				<div class="space-y-1 sm:col-span-2">
					<Label for="title">
						Expense Title <span class="text-destructive">*</span>
					</Label>
					<Input id="title" bind:value={title} required />
				</div>

				<!-- Payee -->
				<div class="space-y-1">
					<Label for="payee">Payee / Vendor</Label>
					<Input id="payee" bind:value={payee} />
				</div>

				<!-- Category -->
				<div class="space-y-1">
					<Label>
						Category <span class="text-destructive">*</span>
					</Label>
					<Select.Root type="single" name="category" bind:value={category} required>
						<Select.Trigger
							class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
						>
							{categoryTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each categoryOptions as cat (cat.value)}
									<Select.Item value={cat.value} label={cat.label}>
										{cat.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>

		<!-- Card 2: Payment & Metadata -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<CreditCard class="size-4 text-primary" /> Payment & Reference
			</h3>
			<Separator />

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- Date of Expense -->
				<div class="space-y-1">
					<Label for="dateOfExpense">
						Date of Expense <span class="text-destructive">*</span>
					</Label>
					<Input id="dateOfExpense" type="date" bind:value={dateOfExpense} required />
				</div>

				<!-- Amount -->
				<div class="space-y-1">
					<Label for="amount">
						Amount (KES) <span class="text-destructive">*</span>
					</Label>
					<div class="relative">
						<Input id="amount" type="number" min="0" step="any" bind:value={amount} required />
					</div>
				</div>

				<!-- Payment Method -->
				<div class="space-y-1">
					<Label>
						Payment Method <span class="text-destructive">*</span>
					</Label>
					<Select.Root type="single" name="paymentMethod" bind:value={paymentMethod}>
						<Select.Trigger
							class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
						>
							{paymentTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each paymentOptions as p (p.value)}
									<Select.Item value={p.value} label={p.label}>
										{p.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Payment Status -->
				<div class="space-y-1">
					<Label>
						Payment Status <span class="text-destructive">*</span>
					</Label>
					<Select.Root type="single" name="paymentStatus" bind:value={paymentStatus}>
						<Select.Trigger
							class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
						>
							{statusTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each statusOptions as s (s.value)}
									<Select.Item value={s.value} label={s.label}>
										{s.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>
	</div>

	<!-- Card 3: Notes -->
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<h3
			class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
		>
			<FileText class="size-4 text-primary" />Notes
		</h3>
		<Separator />

		<div class="space-y-1">
			<Textarea
				id="notes"
				placeholder="Optional remarks, invoice details, or context..."
				bind:value={notes}
				class="h-20"
			/>
		</div>
	</div>

	<!-- Form Actions -->
	<div class="flex items-center justify-end gap-3 pt-2">
		<Button type="button" variant="outline" href="/expenses">Cancel</Button>
		<Button type="submit" disabled={isSubmitting}>
			{isSubmitting ? 'Saving...' : expense ? 'Update Expense' : 'Save Expense'}
		</Button>
	</div>
</form>
