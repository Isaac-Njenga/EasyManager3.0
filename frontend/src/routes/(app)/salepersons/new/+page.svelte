<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SalepersonForm from '$lib/components/modules/salepersons/saleperson.form.svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import type { CreateSalespersonInput } from '$lib/services/salesperson/salesperson.types';
	import { resolve } from '$app/paths';
	import { salespersonService } from '$lib/services/salesperson/salesperson.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';

	let { data }: PageProps = $props();

	const shops = $derived(data.shops);
	const error = $derived(data.error);

	let isSubmitting = $state(false);

	$effect(() => {
		if (error) {
			toast.error('Failed to load shops', { description: error });
		}
	});

	// --- Form Submission ---
	async function handleCreate(payload: CreateSalespersonInput) {
		isSubmitting = true;

		try {
			await salespersonService.create(getBrowserServiceContext(), payload);

			toast.success('Sales member created!');
			goto(resolve('/salepersons'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Sales member creation failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Add a Sales Member"
		description="Fill out the form to create a new sales member."
		actionLabel="Back to Salepersons"
		actionHref="/salepersons"
	/>

	<SalepersonForm {shops} onSubmit={handleCreate} {isSubmitting} />
</div>
