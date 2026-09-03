<script lang="ts">
	import ExpenseForm from '$lib/components/modules/expenses/expenses.form.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { CreateExpenseInput } from '$lib/services/expenses/expense.types';
	import { resolve } from '$app/paths';
	import { expenseService } from '$lib/services/expenses/expense.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';

	let isSubmitting = $state(false);

	async function handleCreate(payload: CreateExpenseInput) {
		isSubmitting = true;

		try {
			await expenseService.create(getBrowserServiceContext(), payload);

			toast.success('Expense created!');
			goto(resolve('/expenses'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Shop creation failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Record Expense"
		description="Record an new expense"
		actionLabel="Back to Expenses"
		actionHref="/expenses"
	/>

	<ExpenseForm onSubmit={handleCreate} {isSubmitting} />
</div>
