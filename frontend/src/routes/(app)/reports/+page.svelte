<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import ProductReport from './product-reports/+page.svelte';
	import SaleReport from './sales-reports/+page.svelte';
	import ExpenseReport from './expense-reports/+page.svelte';
	import LocationReport from './location-reports/+page.svelte';
</script>

<div class="space-y-6">
	<PageHeader title="Reports" description="View all your reports and data." />

	<Tabs.Root value="product" class="w-full">
		<Tabs.List>
			<Tabs.Trigger value="product">Product Reports</Tabs.Trigger>
			<Tabs.Trigger value="sales">Sale Reports</Tabs.Trigger>
			<Tabs.Trigger value="expenses">Expense Reports</Tabs.Trigger>
			<Tabs.Trigger value="locations">Shops & Warehouses Reports</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="product" class="mt-4">
			<ProductReport />
		</Tabs.Content>
		<Tabs.Content value="sales" class="mt-4">
			<SaleReport />
		</Tabs.Content>
		<Tabs.Content value="expenses" class="mt-4">
			<ExpenseReport />
		</Tabs.Content>
		<Tabs.Content value="locations" class="mt-4">
			<LocationReport />
		</Tabs.Content>
	</Tabs.Root>
</div>
