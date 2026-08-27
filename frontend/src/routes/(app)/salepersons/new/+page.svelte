<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SalepersonForm from '$lib/components/modules/salepersons/saleperson.form.svelte';
</script>

<div class="space-y-6">
	<PageHeader
		title="Add a Sales Member"
		description="Fill out the form to create a new sales member."
		actionLabel="Back to Salepersons"
		actionHref="/salepersons"
	/>

	<SalepersonForm />
</div>
