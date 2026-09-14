<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import WebProductForm from '$lib/components/modules/website/website.form.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { CreateWebProductInput } from '$lib/services/website/website.types';
	import { resolve } from '$app/paths';
	import { webProductService } from '$lib/services/website/website.service';
	import { getBrowserServiceContext } from '$lib/services/api/browser-context';

	let isSubmitting = $state(false);

	async function handleCreate(payload: CreateWebProductInput) {
		isSubmitting = true;

		try {
			await webProductService.create(getBrowserServiceContext(), payload);
			console.log(payload);
			toast.success('Item created!');
			goto(resolve('/website'));
		} catch (error) {
			const description =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			toast.error('Item creation failed', { description });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Add A Product"
		description="Create a new product and add it to the website."
		actionLabel="Back to the Website"
		actionHref="/website"
	/>

	<WebProductForm onSubmit={handleCreate} {isSubmitting} />
</div>
