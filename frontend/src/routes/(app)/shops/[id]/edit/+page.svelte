<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ShopForm from '$lib/components/modules/shop/shop.form.svelte';
	import type { PageProps } from '../$types';

	let { data }: PageProps = $props();

	const shop = $derived(data.shop);
</script>

<div class="space-y-6">
	<PageHeader
		title="Edit Shop"
		description="Edit this shop's details"
		actionLabel="Back to Shops"
		actionHref="/shops"
	/>

	<ShopForm {shop} />
</div>
