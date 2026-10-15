<script lang="ts">
	import type { Product } from '$lib/services/product/product.types';
	import type { ShopInventoryItem } from '$lib/services/shop/shop.types';
	import type { WarehouseInventoryItem } from '$lib/services/warehouse/warehouse.types';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { matchesSearchQuery } from '$lib/utils';

	type InventoryRecord = ShopInventoryItem | WarehouseInventoryItem;
	type Props = {
		products: Product[];
		inventoryItems?: InventoryRecord[];
		onAdjust: (productId: string, quantity: number) => Promise<void>;
	};

	let { products, inventoryItems = [], onAdjust }: Props = $props();
	let searchTerm = $state('');
	let quantities = $state<Record<string, string>>({});
	let savingProductId = $state('');

	const uniqueProducts = $derived(
		Array.from(
			products
				.reduce((unique, product) => unique.set(product._id, product), new Map<string, Product>())
				.values()
		)
	);

	const rows = $derived(
		uniqueProducts
			.map((product) => {
				const record = inventoryItems.find((entry) => {
					if (!entry?.product) return false;
					const value = entry.product;
					return String(typeof value === 'object' ? value._id : value) === product._id;
				});
				return { product, currentQuantity: Number(record?.quantity ?? 0) };
			})
			.filter((row) => matchesSearchQuery(row.product, searchTerm))
	);

	$effect(() => {
		for (const row of rows) {
			if (quantities[row.product._id] === undefined) {
				quantities[row.product._id] = String(row.currentQuantity);
			}
		}
	});

	async function saveQuantity(productId: string) {
		const nextQuantity = Number(quantities[productId]);
		if (!Number.isInteger(nextQuantity) || nextQuantity < 0) return;

		savingProductId = productId;
		try {
			await onAdjust(productId, nextQuantity);
		} finally {
			savingProductId = '';
		}
	}
</script>

<div class="space-y-3">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<h3 class="text-sm font-semibold">Reconcile stock</h3>
			<p class="text-xs text-muted-foreground">
				Set the verified on-hand quantity. Product totals are adjusted by the difference.
			</p>
		</div>
		<div class="w-full sm:w-72">
			<Label for="stock-search" class="sr-only">Search products</Label>
			<Input
				id="stock-search"
				bind:value={searchTerm}
				placeholder="Search..."
			/>
		</div>
	</div>

	<div class="max-h-112 overflow-auto rounded-md border">
		<table class="w-full min-w-xl text-left text-sm">
			<thead class="sticky top-0 bg-muted text-xs text-muted-foreground">
				<tr>
					<th class="px-3 py-2">Product</th>
					<th class="px-3 py-2 text-right">Current</th>
					<th class="w-36 px-3 py-2">Verified quantity</th>
					<th class="w-24 px-3 py-2"></th>
				</tr>
			</thead>
			<tbody class="divide-y">
				{#each rows as row (row.product._id)}
					<tr>
						<td class="px-3 py-2">
							<div class="font-medium uppercase">{row.product.name}</div>
							<div class="text-xs text-muted-foreground uppercase">Code: {row.product.code}</div>
							{#if Number(quantities[row.product._id]) !== row.currentQuantity}
								<div class="mt-1 text-xs text-muted-foreground">
									Total after save: {row.product.totalQuantity +
										Number(quantities[row.product._id] || 0) -
										row.currentQuantity}
								</div>
							{/if}
						</td>
						<td class="px-3 py-2 text-right font-mono">{row.currentQuantity}</td>
						<td class="px-3 py-2">
							<Label for={`quantity-${row.product._id}`} class="sr-only">
								Verified quantity for {row.product.name}
							</Label>
							<Input
								id={`quantity-${row.product._id}`}
								type="number"
								min="0"
								step="1"
								bind:value={quantities[row.product._id]}
								class="h-8 text-right font-mono"
							/>
						</td>
						<td class="px-3 py-2 text-right">
							<Button
								size="xs"
								disabled={savingProductId !== '' ||
									!Number.isInteger(Number(quantities[row.product._id])) ||
									Number(quantities[row.product._id]) < 0 ||
									Number(quantities[row.product._id]) === row.currentQuantity}
								onclick={() => saveQuantity(row.product._id)}
							>
								{savingProductId === row.product._id ? 'Saving...' : 'Save'}
							</Button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="px-3 py-8 text-center text-xs text-muted-foreground">
							No matching products.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
