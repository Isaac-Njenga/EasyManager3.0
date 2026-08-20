<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SaleForm from '$lib/components/modules/sales/sales.form.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const sale = $derived(data.sale);

</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Sale"
		description="Edit this sale"
		actionLabel="Back to Sales"
		actionHref="/sales"
	/>

    <div><p>{sale._id}</p></div>

	<SaleForm {sale} />
</div>
