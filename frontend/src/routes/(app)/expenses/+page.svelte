<script lang="ts">
	import Search from '$lib/components/common/Search.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { expensesData as expenses } from '$lib/data/expenses.data';
	import ExpenseTable from '$lib/components/modules/expenses/expenses.table.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let searchTerm = $state('');
	let selectedStatus = $state('All');

	let isSearching = $state(false);

	const statusTags = ['All', 'Paid', 'Pending', 'Cancelled'];

	let filteredExpenses = $derived(
		expenses.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesStatus = selectedStatus === 'All' || item.paymentStatus === selectedStatus;
			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));
			return matchesSearch && matchesStatus;
		})
	);
</script>

<div class="space-y-6">
	<PageHeader
		title="Expenses"
		description="Manage and keep track of your expenses."
		actionLabel="Record An Expense"
		actionHref="/expenses/new"
	/>

	<div class="mb-3">
		<div class="mb-3">
			<!-- 3. Pass state and updater callback -->
			<Search
				value={searchTerm}
				bind:isLoading={isSearching}
				onChange={(val) => (searchTerm = val)}
			/>
		</div>
		<div class="flex gap-2">
			{#each statusTags as tag (tag)}
				<Badge
					variant={selectedStatus === tag ? 'default' : 'outline'}
					onclick={() => (selectedStatus = tag)}
					class="pointer-fine:cursor-pointer"
				>
					{tag}
				</Badge>
			{/each}
		</div>
	</div>

	<div>
		{#if isSearching}
			<div class="align-center flex flex-row items-center justify-center gap-4">
				<Loader2Icon class="animate-spin" />
				<div class="py-8 text-center text-muted-foreground">Loading expenses...</div>
			</div>
		{:else}
			{#if searchTerm}
				<div class="mb-2 text-sm text-muted-foreground">
					Showing results for <b>"{searchTerm}"</b>
				</div>
			{/if}
			<ExpenseTable {filteredExpenses} />
		{/if}
	</div>
</div>
