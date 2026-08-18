<script lang="ts">
	import DataTable from '$lib/components/common/DataTable.svelte';
	import ImagePreview from '$lib/components/common/ImagePreview.svelte';

	import { Button } from '$lib/components/ui/button';

	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	import { productColumns } from '$lib/config/product.columns';

	import type { Product } from '$lib/types/product.types';

	type Props = {
		filteredProducts: Product[];
	};

	let { filteredProducts }: Props = $props();

	function viewProduct(product: Product) {
		console.log('View product:', product._id);
	}

	function editProduct(product: Product) {
		console.log('Edit product:', product._id);
	}

	function deleteProduct(product: Product) {
		console.log('Delete product:', product._id);
	}
</script>

{#snippet imageCell(_value: unknown, product: Product)}
	{#if product.image.length > 0}
		<ImagePreview src={product.image[0]} alt={product.name} class="size-12" />
	{:else}
		<div class="flex size-12 items-center justify-center rounded-md border bg-muted">
			<span class="text-xs text-muted-foreground"> No image </span>
		</div>
	{/if}
{/snippet}

{#snippet nameCell(_value: unknown, product: Product)}
	<div class="max-w-[280px]">
		<div class="truncate font-medium">
			{product.name}
		</div>

		{#if product.description}
			<div class="truncate text-xs text-muted-foreground">
				{product.description}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet actionsCell(_value: unknown, product: Product)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button variant="ghost" size="icon" class="size-8" aria-label={`Actions for ${product.name}`}>
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewProduct(product)}>View</DropdownMenuItem>

			<DropdownMenuItem onclick={() => editProduct(product)}>Edit</DropdownMenuItem>

			<DropdownMenuSeparator />

			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => deleteProduct(product)}
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<DataTable
	data={filteredProducts}
	columns={productColumns}
	getRowKey={(product) => product._id}
	emptyMessage="No products found."
	cells={{
		imageCell,
		nameCell,
		actionsCell
	}}
></DataTable>
