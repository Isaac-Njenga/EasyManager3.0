<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SalepersonForm from '$lib/components/modules/salepersons/saleperson.form.svelte';
	import type { PageProps } from '../$types';

	let { data }: PageProps = $props();

	const salesperson = $derived(data.saleperson);
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Sale Member"
		description="Edit this saleperson's details."
		actionLabel="Back to Salepersons"
		actionHref="/salepersons"
	/>

	<pre>{JSON.stringify(salesperson, null, 2)}</pre>

	<SalepersonForm {salesperson} isEditMode={true} />
</div>
