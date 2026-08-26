<script lang='ts'>
	import type { Product } from '$lib/types/product.types';
    import type { PageProps } from './$types';
    import LogFooter from '$lib/components/common/LogFooter.svelte';
	
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductsTable from '$lib/components/modules/products/products.table.svelte';
	// import Search from '$lib/components/common/Search.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import Boxes from '@lucide/svelte/icons/boxes';

const typeTags = [
		{ label: 'Warehouse-Warehouse', value: 'inter_warehouse' },
		{ label: 'Shop-Warehouse', value: 'return_to_hub' },
		{ label: 'Warehouse-Shop', value: 'store_replenishment' },
		{ label: 'Shop-Shop', value: 'inter_shop' }
	];

	let { data }: PageProps = $props();

    const selectedTransfer = $derived(data.transfer);

    let searchTerm = $state('');
	let isSearching = $state(false);

    const populatedProducts = $derived.by<Product[]>(() => {
		if (!selectedTransfer?.items) return [];
		return selectedTransfer.items.filter(
			(item): item is Product => typeof item === 'object' && item !== null && '_id' in item
		);
	});

	let filteredInventory = $derived(
		populatedProducts.filter((item) => {
			const normalizedSearch = searchTerm.trim().toLowerCase();

			const matchesSearch =
				!normalizedSearch ||
				Object.values(item).some((value) => String(value).toLowerCase().includes(normalizedSearch));

			return matchesSearch;
		})
	);
</script>

{#if selectedTransfer}
	<div class="space-y-6">
		<PageHeader
			title={`${selectedTransfer.source.name} to ${selectedTransfer.destination.name}`}
			description={`${selectedTransfer.transferNumber} | ${typeTags.find((t) => t.value === selectedTransfer.type)?.label}`}
			actionLabel="Back to Transfers"
			actionHref="/transfers"
		/>

        <!-- Inventory Products Section -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			{#if isSearching}
				<div class="flex items-center justify-center gap-4 py-8">
					<Loader2Icon class="size-5 animate-spin text-primary" />
					<div class="text-muted-foreground">Loading items...</div>
				</div>
			{:else}
				<div class="flex items-center justify-between">
					<div>
						<h3
							class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
						>
							<Boxes class="size-4 text-primary" /> Inventory Items transferred
						</h3>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-xs font-medium text-muted-foreground">
							Products:{populatedProducts.length}
						</span>						
					</div>
				</div>
				<Separator />

				{#if searchTerm}
					<div class="mb-2 text-sm text-muted-foreground">
						Showing results for <b>"{searchTerm}"</b> ({filteredInventory.length} found)
					</div>
				{/if}
				<div class="space-y-3">
					<!-- <Search
						value={searchTerm}
						bind:isLoading={isSearching}
						onChange={(val) => (searchTerm = val)}
					/> -->
				</div>
				{#if populatedProducts.length > 0}
					<ProductsTable
						filteredProducts={filteredInventory}
						// shopId={selectedWarehouse._id}
					/>
				{:else}
					<div class="py-8 text-center text-xs text-muted-foreground">
						No product records loaded for this transfer.
					</div>
				{/if}
			{/if}
		</div>

        <!-- Operational Remarks & Notes -->
		{#if selectedTransfer.notes}
			<div class="space-y-2 rounded-xl border bg-card p-5 shadow-sm">
				<h3
					class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
				>
					<FileText class="size-4 text-primary" /> Notes
				</h3>
				<Separator />
				<p
					class="rounded-md bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre-wrap text-foreground"
				>
					{selectedTransfer.notes}
				</p>
			</div>
		{/if}

		<LogFooter
			createTimestamp={selectedTransfer.createdAt}
			updateTimestamp={selectedTransfer.updatedAt}
		/>

    </div>{:else}
	<div class="py-12 text-center text-xs text-muted-foreground">
		No transfer selected to display details.
	</div>
{/if}