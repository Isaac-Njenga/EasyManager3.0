<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SalepersonForm from '$lib/components/modules/salepersons/saleperson.form.svelte';
	import type { PageProps } from '../$types';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { salespersonService } from '$lib/services/salesperson/salesperson.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';
	import type { CreateSalespersonInput } from '$lib/services/salesperson/salesperson.types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	const selectedSalesperson = $derived(data.salesperson);
	const shops = $derived(data.shops );
	const error = $derived(data.error);

	let isSubmitting = $state(false);

	$effect(() => {
		if (error) {
			toast.error('Failed to load data', { description: error });
		}
	});

	async function handleUpdate(payload: CreateSalespersonInput) {
		if (!selectedSalesperson?._id) return;
		isSubmitting = true;

		try {
			await salespersonService.update(getBrowserServiceContext(), selectedSalesperson._id, payload);

			toast.success('Salesperson updated!');
			goto(resolve('/salepersons'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Salesperson update failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Sale Member"
		description="Edit this saleperson's details."
		actionLabel="Back to Salepersons"
		actionHref="/salepersons"
	/>

	{#if error}
		<div class="flex items-center justify-center py-10">
			<p class="text-destructive">Failed to load salesperson details: {error}</p>
		</div>
	{:else}
		<SalepersonForm
			salesperson={selectedSalesperson}
			shops={shops}
			onSubmit={handleUpdate}
			{isSubmitting}
		/>{/if}
</div>
