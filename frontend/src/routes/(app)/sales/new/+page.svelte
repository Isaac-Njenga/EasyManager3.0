<script lang="ts">
	import SaleForm from '$lib/components/modules/sales/sales.form.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { CreateSaleInput } from '$lib/services/sales/sales.types';
	import { resolve } from '$app/paths';
	import { saleService } from '$lib/services/sales/sales.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const products = $derived(data.products);
	const shops = $derived(data.shops);
	const salespersons = $derived(data.salespersons);
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load data', { description: error });
		}
	});

	let isSubmitting = $state(false);

	async function handleCreate(payload: CreateSaleInput) {
		isSubmitting = true;

		try {
			await saleService.create(getBrowserServiceContext(), payload);

			toast.success('Sale created!');
			goto(resolve('/sales'));
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
		actionLabel="Back to Sales"
		actionHref="/sales"
	/>

	<SaleForm {shops} {products} {salespersons} onSubmit={handleCreate} {isSubmitting} />
</div>
