<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SaleForm from '$lib/components/modules/sales/sales.form.svelte';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import type { CreateSaleInput } from '$lib/services/sales/sales.types';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { saleService } from '$lib/services/sales/sales.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';

	let { data }: PageProps = $props();

	const selectedSale = $derived(data.sale);
	const products = $derived(data.products);
	const salespersons = $derived(data.salespersons);
	const shops = $derived(data.shops);
	const error = $derived(data.error);

	let isSubmitting = $state(false);

	$effect(() => {
		if (error) {
			toast.error('Failed to load sale', { description: error });
		}
	});

	async function handleUpdate(payload: CreateSaleInput) {
		if (!selectedSale?._id) return;
		isSubmitting = true;

		try {
			await saleService.update(getBrowserServiceContext(), selectedSale._id, payload);

			toast.success('Sale Updated Successfully!');
			goto(resolve('/sales'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Sale update failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Sale"
		description="Edit this sale"
		actionLabel="Back to Sales"
		actionHref="/sales"
	/>

	{#if error}
		<div class="flex items-center justify-center py-10">
			<p class="text-destructive">Failed to load sale details: {error}</p>
		</div>
	{:else}
		<SaleForm
			{shops}
			{products}
			{salespersons}
			sale={selectedSale}
			onSubmit={handleUpdate}
			{isSubmitting}
		/>{/if}
</div>
