<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import DataTable from '$lib/components/modules/salepersons/saleperson-table/saleperson.table.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { SalepersonColumns } from '$lib/components/modules/salepersons/saleperson-table/saleperson.columns';

	let { data }: PageProps = $props();

	const salespersons = $derived(data.salespersons ?? []);
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load salespersons', { description: error });
		}
	});

	let isSearching = $state(false);
</script>

<svelte:head>
	<title>Salepersons</title>
</svelte:head>
<div class="space-y-6">
	<PageHeader
		title="Salepersons"
		description="Manage all your sales staff."
		actionLabel="+ Add a Saleperson "
		actionHref="/salepersons/new"
	/>

	<!-- Search & Filters -->
	<div class="space-y-4 rounded-xl border bg-card shadow-sm">
		<!-- Table Container -->
		<div>
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading Salepersons...</div>
				</div>
			{:else}
				<DataTable data={salespersons} columns={SalepersonColumns} />
			{/if}
		</div>
	</div>
</div>
