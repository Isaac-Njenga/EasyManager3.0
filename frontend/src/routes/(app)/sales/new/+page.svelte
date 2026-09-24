<script lang="ts">
	import SaleForm from '$lib/components/modules/sales/sales.form.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { toast } from 'svelte-sonner';
	import type { CreateSaleInput } from '$lib/services/sales/sales.types';
	import { saleService } from '$lib/services/sales/sales.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const products = $derived(data.products);
	const shops = $derived(data.shops);
	const salespersons = $derived(data.salespersons);
	const isSalesperson = $derived(data.role === 'SALESPERSON');
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load data', { description: error });
		}
	});

	let isSubmitting = $state(false);
	let resetKey = $state(0);

	async function handleCreate(payload: CreateSaleInput) {
		isSubmitting = true;

		try {
			await saleService.create(getBrowserServiceContext(), payload);

			resetKey += 1;
			toast.success('Sale recorded!', {
				description: isSalesperson ? 'You can now record another sale.' : undefined
			});
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Sale creation failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Record Sale"
		description="Record a new sale"
		actionLabel={isSalesperson ? undefined : 'Back to Sales'}
		actionHref={isSalesperson ? undefined : '/sales'}
	/>

	<SaleForm
		{shops}
		{products}
		{salespersons}
		lockedSalesperson={isSalesperson}
		{resetKey}
		onSubmit={handleCreate}
		{isSubmitting}
	/>
</div>
