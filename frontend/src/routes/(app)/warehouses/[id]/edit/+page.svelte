<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import WarehouseForm from '$lib/components/modules/warehouses/warehouse.form.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { warehouseService } from '$lib/services/warehouse/warehouse.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type { CreateWarehouseInput } from '$lib/types/warehouse.types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	const selectedWarehouse = $derived(data.warehouse);
	const error = $derived(data.error);

	let isSubmitting = $state(false);

	$effect(() => {
		if (error) {
			toast.error('Failed to load warehouse', { description: error });
		}
	});

	async function handleUpdate(payload: CreateWarehouseInput) {
		if (!selectedWarehouse?._id) return;
		isSubmitting = true;

		try {
			await warehouseService.update(getBrowserServiceContext(), selectedWarehouse._id, payload);

			toast.success('Warehouse Updated Successfully!');
			goto(resolve('/warehouses'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Warehouse update failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Warehouse"
		description="Edit the form to update this warehouse."
		actionLabel="Back to Warehouses"
		actionHref="/warehouses"
	/>

	{#if error}
		<div class="flex items-center justify-center py-10">
			<p class="text-destructive">Failed to load shop details: {error}</p>
		</div>
	{:else}
		<WarehouseForm warehouse={selectedWarehouse} onSubmit={handleUpdate} {isSubmitting} />{/if}
</div>
