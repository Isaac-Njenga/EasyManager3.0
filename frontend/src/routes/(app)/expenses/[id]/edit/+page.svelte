<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ExpenseForm from '$lib/components/modules/expenses/expenses.form.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { expenseService } from '$lib/services/expenses/expense.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import { goto } from '$app/navigation';
	import type { CreateExpenseInput } from '$lib/services/expenses/expense.types';

	let { data }: PageProps = $props();

	const selectedExpense = $derived(data.expense);
	const error = $derived(data.error);

	let isSubmitting = $state(false);

	$effect(() => {
		if (error) {
			toast.error('Failed to load expense', { description: error });
		}
	});

	async function handleUpdate(payload: CreateExpenseInput) {
		if (!selectedExpense?._id) return;
		isSubmitting = true;

		try {
			await expenseService.update(getBrowserServiceContext(), selectedExpense._id, payload);

			toast.success('Expense updated');
			goto(resolve('/expenses'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Expense update failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Expense"
		description="Edit this expense"
		actionLabel="Back to Expenses"
		actionHref="/expenses"
	/>

	{#if error}
		<div class="flex items-center justify-center py-10">
			<p class="text-destructive">Failed to load shop details: {error}</p>
		</div>
	{:else}
		<ExpenseForm expense={selectedExpense} onSubmit={handleUpdate} {isSubmitting} />
	{/if}
</div>
