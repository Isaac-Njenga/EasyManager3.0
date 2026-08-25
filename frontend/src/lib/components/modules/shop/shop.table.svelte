<script lang="ts">
	import DataTable from '$lib/components/common/DataTable.svelte';
	import DataDrawer from '$lib/components/common/DataDrawer.svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	import { shopColumns } from '$lib/components/modules/shop/shop.columns';
	import type { Shop, ShopStatus, ShopType } from '$lib/types/shop.types';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DeleteDialog from '$lib/components/common/DeleteDialog.svelte';
	import ShopDetails from '../../../../routes/(app)/shops/ShopDetails.svelte';

	type Props = {
		filteredShops: Shop[];
	};

	let { filteredShops }: Props = $props();

	let isDrawerOpen = $state(false);
	let isDeleteShopOpen = $state(false);
	let selectedShop = $state<Shop | null>(null);

	function viewShop(shop: Shop) {
		selectedShop = shop;
		goto(resolve(`/shops/${shop._id}`));
		// isDrawerOpen = true;
	}

	function editShop(shop: Shop) {
		goto(resolve(`/shops/${shop._id}/edit`));
	}

	function openDeleteModal(shop: Shop) {
		selectedShop = shop;
		isDeleteShopOpen = true;
	}

	function deleteShop(shop: Shop) {
		console.log('Delete shop:', shop._id);
		isDeleteShopOpen = false;
		selectedShop = null;
		isDrawerOpen = false;
	}
</script>

<!-- Custom Snippet Definitions using value parameter -->

{#snippet codeCell(value: unknown, shop: Shop)}
	<div class="w-full">
		<span class="font-mono text-xs font-medium text-foreground">
			{String(value ?? shop.shopCode ?? '')}
		</span>
	</div>
{/snippet}

{#snippet nameCell(value: unknown, shop: Shop)}
	<div class="w-full">
		<div class="truncate font-medium text-foreground">{String(value ?? shop.name)}</div>
		{#if shop.address?.building}
			<div class="truncate text-xs text-muted-foreground">
				{shop.address.building}
			</div>
		{/if}
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet typeCell(value: unknown, _shop: Shop)}
	{@const type = (value as ShopType) ?? 'Retail Store'}
	<Badge variant={type === 'Showroom' ? 'secondary' : 'outline'}>
		{type}
	</Badge>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet statusCell(value: unknown, _shop: Shop)}
	{@const status = (value as ShopStatus) ?? 'Active'}
	{#if status === 'Active'}
		<Badge
			variant="outline"
			class="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
		>
			Active
		</Badge>
	{:else if status === 'Under Maintenance'}
		<Badge
			variant="outline"
			class="border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400"
		>
			Under Maintenance
		</Badge>
	{:else}
		<Badge
			variant="outline"
			class="border-zinc-500/30 bg-zinc-500/10 text-zinc-500 dark:text-zinc-400"
		>
			Inactive
		</Badge>
	{/if}
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet stockCell(value: unknown, shop: Shop)}
	<div class="flex flex-col">
		<span class="font-medium text-foreground">
			{shop.inventorySummary?.totalItemsInStock.toLocaleString() ?? 0} units
		</span>
		<span class="text-xs text-muted-foreground">
			{shop.inventorySummary?.totalProducts ?? 0} items
		</span>
	</div>
{/snippet}

<!-- eslint-disable-next-line -->
{#snippet actionsCell(_value: unknown, shop: Shop)}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button variant="ghost" size="icon" class="size-8" aria-label={`Actions for ${shop.name}`}>
				<MoreHorizontal class="size-4" />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={() => viewShop(shop)}>View</DropdownMenuItem>
			<DropdownMenuItem onclick={() => editShop(shop)}>Edit</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				class="text-destructive focus:text-destructive"
				onclick={() => openDeleteModal(shop)}
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<!-- Data Table -->
<DataTable
	data={filteredShops}
	columns={shopColumns}
	getRowKey={(shop) => shop._id}
	emptyMessage="No Shops found."
	cells={{
		codeCell,
		nameCell,
		typeCell,
		statusCell,
		stockCell,
		actionsCell
	}}
/>

<!-- Reusable shop Drawer -->
<DataDrawer
	bind:open={isDrawerOpen}
	title={selectedShop?.name ?? 'Shop Details'}
	description={selectedShop ? `${selectedShop.shopCode}` : ''}
	direction="right"
>
	<ShopDetails {selectedShop} />
	{#snippet footer()}
		<div class="flex w-full flex-col gap-2">
			<div class="grid w-full grid-cols-2 gap-2">
				<Button href={`/shops/${selectedShop?._id}`} size="xs" class="w-full">Edit Shop</Button>
				<Button
					onclick={() => openDeleteModal(selectedShop!)}
					size="xs"
					variant="destructive"
					class="w-full"
				>
					Delete Shop
				</Button>
			</div>

			<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'xs', class: 'w-full' })}>
				Close
			</Drawer.Close>
		</div>
	{/snippet}
</DataDrawer>

<DeleteDialog bind:open={isDeleteShopOpen} handleDelete={() => deleteShop(selectedShop!)} />
