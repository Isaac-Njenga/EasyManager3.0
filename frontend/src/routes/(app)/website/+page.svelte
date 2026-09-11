<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { webProductsData } from '$lib/data/website.data';

	let searchTerm = $state('');
	let isSearching = $state(false);
	let selectedStatus = $state('All');

	const categoryTags = ['All', 'Office Furniture', 'Living Room Furniture', 'Outdoor Furniture'];

	let filteredContent = $derived(
		webProductsData.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesStatus = selectedStatus === 'All' || item.category === selectedStatus;
			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));

			return matchesSearch && matchesStatus;
		})
	);
</script>

<div class="space-y-6">
	<PageHeader
		title="EasyDeal Furniture's Website"
		description="Manage EasyDeal's website."
		actionLabel="+ Add A Product"
		actionHref="/website/new"
	/>

	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="space-y-3">
			<Search
				value={searchTerm}
				bind:isLoading={isSearching}
				onChange={(val) => (searchTerm = val)}
			/>

			<div class="flex items-center justify-between">
				<div class="flex gap-2">
					{#each categoryTags as tag (tag)}
						<Badge
							variant={selectedStatus === tag ? 'default' : 'outline'}
							onclick={() => (selectedStatus = tag)}
							class="pointer-fine:cursor-pointer"
						>
							{tag}
						</Badge>
					{/each}
				</div>

				<span class="text-xs font-medium text-muted-foreground">
					Products: {filteredContent.length}
				</span>
			</div>
		</div>

		<!-- Table Container -->
		<div>
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading Warehouses...</div>
				</div>
			{:else}
				<Separator class="mb-4" />
				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b> ({filteredContent.length} found)
					</div>
				{/if}

				<!-- <WebsiteTable {filteredContent} {webProductsData} /> -->
			{/if}
		</div>
	</div>
</div>
