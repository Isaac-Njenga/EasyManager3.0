<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductTable from '$lib/components/modules/products/products.table.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	import Search from '$lib/components/common/Search.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';

	let { data }: PageProps = $props();

	const products = $derived(data.products ?? []);
	const error = $derived(data.error);

	// Toast error alert if server load failed
	$effect(() => {
		if (error) {
			toast.error('Failed to load products', { description: error });
		}
	});

	let searchTerm = $state('');
	let selectedStatus = $state('All');

	let isSearching = $state(false);

	const statusTags = ['All', 'Active', 'Inactive'];

	let filteredProducts = $derived(
		products.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));
			return matchesSearch && matchesStatus;
		})
	);
</script>

<div class="space-y-6">
	<PageHeader
		title="Products"
		description="Manage your products and inventory."
		actionLabel="+ Add A Product"
		actionHref="/products/new"
	/>

	<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
		<div class="mb-3">
			<div class="mb-3">
				<!-- 3. Pass state and updater callback -->
				<Search
					value={searchTerm}
					bind:isLoading={isSearching}
					onChange={(val) => (searchTerm = val)}
				/>
			</div>
			<div class="flex items-center justify-between">
				<div class="flex gap-2">
					{#each statusTags as tag (tag)}
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
					Products: {filteredProducts.length}
				</span>
			</div>
		</div>

		<div>
			{#if isSearching}
				<div class="align-center flex flex-row items-center justify-center gap-4">
					<Loader2Icon class="animate-spin" />
					<div class="py-8 text-center text-muted-foreground">Loading products...</div>
				</div>
			{:else}
				<Separator class="mb-4" />
				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b>
					</div>
				{/if}
				<ProductTable {filteredProducts} />
			{/if}
		</div>
	</div>
</div>
