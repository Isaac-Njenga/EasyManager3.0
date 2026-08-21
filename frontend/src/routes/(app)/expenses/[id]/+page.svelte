<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ExpenseForm from '$lib/components/modules/expenses/expenses.form.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const expense = $derived(data.expense);
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Expense"
		description="Edit this expense"
		actionLabel="Back to Expenses"
		actionHref="/expenses"
	/>

	<ExpenseForm {expense} />
</div>
