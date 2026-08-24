<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import WarehouseForm from '$lib/components/modules/warehouses/warehouse.form.svelte';
	import type { PageProps } from './$types';

    let {data}:PageProps = $props();

    const warehouse = $derived(data.warehouse)
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Warehouse"
		description="Edit the form to update this warehouse."
		actionLabel="Back to Warehouses"
		actionHref="/warehouses"
	/>

	<WarehouseForm {warehouse}/>
</div>
