<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import WarehouseForm from '$lib/components/modules/warehouses/warehouse.form.svelte';
</script>

<div class="space-y-6">
	<PageHeader
		title="Add a New Warehouse"
		description="Fill out the form to create a new warehouse."
		actionLabel="Back to Warehouses"
		actionHref="/warehouses"
	/>

	<WarehouseForm />
</div>
