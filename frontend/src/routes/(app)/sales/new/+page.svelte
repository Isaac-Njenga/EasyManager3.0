<script lang="ts">
	import SaleForm from '$lib/components/modules/sales/sales.form.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
</script>

<div class="space-y-6">
	<PageHeader
		title="Record Sale"
		description="Record a new sale"
		actionLabel="Back to Sales"
		actionHref="/sales"
	/>

	<SaleForm />
</div>
