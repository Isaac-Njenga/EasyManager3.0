<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import WarehouseForm from '$lib/components/modules/warehouses/warehouse.form.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { CreateWarehouseInput } from '$lib/types/warehouse.types';
	import { resolve } from '$app/paths';
	import { warehouseService } from '$lib/services/warehouse/warehouse.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';

	let isSubmitting = $state(false);

	// --- Form Submission ---
	async function handleCreate(payload: CreateWarehouseInput) {
		isSubmitting = true;

		try {
			await warehouseService.create(getBrowserServiceContext(), payload);

			toast.success('Warehouse Created Successfully!');
			goto(resolve('/warehouses'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Warehouse creation failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Add a New Warehouse"
		description="Fill out the form to create a new warehouse."
		actionLabel="Back to Warehouses"
		actionHref="/warehouses"
	/>

	<WarehouseForm onSubmit={handleCreate} {isSubmitting} />
</div>
