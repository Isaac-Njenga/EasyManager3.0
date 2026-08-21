<script lang="ts">
	import ExpenseForm from '$lib/components/modules/expenses/expenses.form.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
</script>

<div class="space-y-6">
	<PageHeader
		title="Record Expense"
		description="Record an new expense"
		actionLabel="Back to Expenses"
		actionHref="/expenses"
	/>

	<ExpenseForm />
</div>
