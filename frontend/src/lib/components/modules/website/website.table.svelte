<script lang="ts">
	import DataTable from '$lib/components/common/DataTable.svelte';

	import { Button } from '$lib/components/ui/button';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	import { websiteColumns } from '$lib/components/modules/website/website.columns';
	import type { WebProduct } from '$lib/services/website/website.types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { formatCurrency } from '$lib/utils';

	type Props = {
		filteredContent: WebProduct[];
	};

	let { filteredContent }: Props = $props();

	let isDeleteWarehouseOpen = $state(false);
	let selectedWebProduct = $state<WebProduct | null>(null);

	function viewWebProduct(webProduct: WebProduct) {
		selectedWebProduct = webProduct;
		goto(resolve(`/website/${webProduct._id}`));
	}

	function editWebProduct(webProduct: WebProduct) {
		goto(resolve(`/website/${webProduct._id}/edit`));
	}

	function openDeleteModal(webProduct: WebProduct) {
		selectedWebProduct = webProduct;
		isDeleteWarehouseOpen = true;
	}

	async function deleteItem(webProduct: WebProduct) {
		try {
			toast.success(`Item ${webProduct.name} deleted`);
			isDeleteWarehouseOpen = false;
			selectedWebProduct = null;
			await invalidateAll();
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to delete item.';
			toast.error('Product deletion failed', { description });
		}
	}
</script>

<!-- Product Image Snippet -->
<!-- eslint-disable-next-line -->
{#snippet imageCell(_value: unknown, webProduct: WebProduct)}
	{#if webProduct.image && webProduct.image.length > 0}
		<img
			src={webProduct.image[0]}
			alt={webProduct.name}
			class="size-16 rounded-md object-contain"
		/>
	{:else}
		<div class="flex size-12 items-center justify-center rounded-md border bg-muted">
			<span class="text-xs text-muted-foreground">No image</span>
		</div>
	{/if}
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet nameCell(_value: unknown, webProduct: WebProduct)}
	<div class="w-full">
		<div class="truncate font-medium">{webProduct.name}</div>

		{#if webProduct.category}
			<div class="truncate text-xs text-muted-foreground">
				Category: {webProduct.category}
			</div>
		{/if}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet priceCell(value: unknown, webProduct: WebProduct)}
	<div class="w-full">
		<p class="text-md">{formatCurrency(webProduct.price)}</p>
	</div>
{/snippet}

<!-- Discount Formatting Snippet -->
{#snippet discountCell(value: unknown)}
	{#if Number(value) > 0}
		<Badge variant="secondary" class="font-mono text-xs">
			-{value}%
		</Badge>
	{:else}
		<span class="text-xs text-muted-foreground">—</span>
	{/if}
{/snippet}

<!-- Stock Status Snippet -->
{#snippet inStockCell(value: unknown)}
	{#if value}
		<Badge variant="outline" class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
			In Stock
		</Badge>
	{:else}
		<Badge variant="outline" class="border-destructive/30 bg-destructive/10 text-destructive">
			Out of Stock
		</Badge>
	{/if}
{/snippet}

<!-- Row Actions Snippet -->
<!-- eslint-disable-next-line -->
{#snippet actionsCell(_value: unknown, webProduct: WebProduct)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button variant="ghost" size="icon" class="size-8">
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewWebProduct(webProduct)}>View</DropdownMenuItem>
			<DropdownMenuItem onclick={() => editWebProduct(webProduct)}>Edit</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => openDeleteModal(webProduct)}
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<!-- Data Table Integration -->
<DataTable
	data={filteredContent}
	columns={websiteColumns}
	getRowKey={(webProduct) => webProduct._id}
	emptyMessage="No content recorded."
	cells={{
		imageCell,
		priceCell,
		discountCell,
		nameCell,
		inStockCell,
		actionsCell
	}}
	pagination
	pageSize={5}
	pageSizeOptions={[5, 10, 20, 50]}
/>

<DeleteDialog
	bind:open={isDeleteWarehouseOpen}
	handleDelete={() => selectedWebProduct && deleteItem(selectedWebProduct)}
/>
