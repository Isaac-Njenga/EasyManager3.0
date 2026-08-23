<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ShopForm from '$lib/components/modules/shop/shop.form.svelte';
</script>

<div class="space-y-6">
	<PageHeader
		title="Create a Shop"
		description="Fill out the form to create a new shop."
		actionLabel="Back to Shops"
		actionHref="/shops"
	/>

	<ShopForm />
</div>
