<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import SalepersonsTable from '$lib/components/modules/salepersons/saleperson.table.svelte';
	import Search from '$lib/components/common/Search.svelte';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';

	let { data }: PageProps = $props();

	const salespersons = $derived(data.salespersons ?? []);
	const error = $derived(data.error);

	$effect(() => {
		if (error) {
			toast.error('Failed to load salespersons', { description: error });
		}
	});

	let searchTerm = $state('');
	let isSearching = $state(false);

	let filteredSalespersons = $derived(
		salespersons.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));

			return matchesSearch;
		})
	);
</script>

<div class="space-y-6">
	<PageHeader
		title="Salepersons"
		description="Manage all your sales staff."
		actionLabel="+ Add a Saleperson "
		actionHref="/salepersons/new"
	/>

	<!-- Search & Filters -->
	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="space-y-3">
			<Search
				value={searchTerm}
				bind:isLoading={isSearching}
				onChange={(val) => (searchTerm = val)}
			/>

			<div class="flex items-center justify-between">
				<div class="flex gap-2"></div>

				<span class="text-xs font-medium text-muted-foreground">
					Salepersons: {filteredSalespersons.length}
				</span>
			</div>
		</div>

		<!-- Table Container -->
		<div>
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading Salepersons...</div>
				</div>
			{:else}
				<Separator class="mb-4" />
				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b> ({filteredSalespersons.length} found)
					</div>
				{/if}

				<SalepersonsTable {filteredSalespersons} />
			{/if}
		</div>
	</div>
</div>
