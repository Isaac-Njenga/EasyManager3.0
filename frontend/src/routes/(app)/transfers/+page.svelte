<script lang="ts">
	import type { LocationType, StockTransferItem } from '$lib/types/transfer.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import PackageCheck from '@lucide/svelte/icons/package-check';
	import { toast } from 'svelte-sonner';

	// Available facilities passed into component
	type LocationOption = { id: string; name: string; type: LocationType };

	type Props = {
		locations: LocationOption[];
		preselectedSourceId?: string;
	};

	let { locations, preselectedSourceId }: Props = $props();

	// --- Form State ---
	let sourceId = $derived(preselectedSourceId ?? '');
	let destinationId = $state('');
	let items = $state<StockTransferItem[]>([
		{ productId: '', productName: '', code: '', quantity: 1 }
	]);
	let notes = $state('');

	// --- Filtered Destination Options ---
	const destinationOptions = $derived(locations.filter((loc) => loc.id !== sourceId));

	function addItem() {
		items = [...items, { productId: '', productName: '', code: '', quantity: 1 }];
	}

	function removeItem(index: number) {
		if (items.length > 1) {
			items = items.filter((_, i) => i !== index);
		}
	}

	function handleTransfer() {
		if (!sourceId || !destinationId) {
			toast.warning('Please select both source and destination locations.');
			return;
		}

		const validItems = items.filter((i) => i.productName.trim() && i.quantity > 0);
		if (validItems.length === 0) {
			toast.warning('Please add at least one item with a valid quantity.');
			return;
		}

		const sourceLoc = locations.find((l) => l.id === sourceId);
		const destLoc = locations.find((l) => l.id === destinationId);

		toast.success(`Transfer Initiated!`, {
			description: `Moving ${validItems.length} item(s) from ${sourceLoc?.name} to ${destLoc?.name}.`
		});
	}
</script>

<div class="space-y-6 p-1">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-lg font-bold tracking-tight text-foreground">Initiate Stock Transfer</h2>
			<p class="text-xs text-muted-foreground">
				Move inventory between warehouses and shops.
			</p>
		</div>
	</div>

	<!-- Source to Destination Routing Cards -->
	<div class="grid grid-cols-1 items-center gap-3 sm:grid-cols-5">
		<!-- Source Select -->
		<div class="space-y-1.5 sm:col-span-2">
			<Label class="text-xs font-semibold">Source Location</Label>
			<Select.Root type="single" bind:value={sourceId}>
				<Select.Trigger class="h-9 w-full text-xs">
					{locations.find((l) => l.id === sourceId)?.name ?? 'Select Origin'}
				</Select.Trigger>
				<Select.Content>
					{#each locations as loc (loc.id)}
						<Select.Item value={loc.id} label={loc.name}>
							<span class="font-medium">{loc.name}</span>
							<span class="ml-1 text-[10px] text-muted-foreground">({loc.type})</span>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Routing Direction Indicator -->
		<div class="flex justify-center pt-4 sm:col-span-1">
			<div class="rounded-full bg-muted p-2 text-muted-foreground">
				<ArrowRight class="size-4" />
			</div>
		</div>

		<!-- Destination Select -->
		<div class="space-y-1.5 sm:col-span-2">
			<Label class="text-xs font-semibold">Destination Location</Label>
			<Select.Root type="single" bind:value={destinationId}>
				<Select.Trigger class="h-9 w-full text-xs">
					{locations.find((l) => l.id === destinationId)?.name ?? 'Select Destination'}
				</Select.Trigger>
				<Select.Content>
					{#each destinationOptions as loc (loc.id)}
						<Select.Item value={loc.id} label={loc.name}>
							<span class="font-medium">{loc.name}</span>
							<span class="ml-1 text-[10px] text-muted-foreground">({loc.type})</span>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<Separator />

	<!-- Line Items Builder -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<span class="text-xs font-bold tracking-wider text-muted-foreground uppercase"
				>Items to Transfer</span
			>
			<Button variant="outline" size="sm" onclick={addItem} class="h-7 text-xs">
				<Plus class="mr-1 size-3" /> Add Item
			</Button>
		</div>

		{#each items as item, index (index)}
			<div class="flex items-center gap-2">
				<Input
					placeholder="Product name or SKU..."
					bind:value={item.productName}
					class="h-9 text-xs"
				/>
				<Input
					type="number"
					min="1"
					placeholder="Qty"
					bind:value={item.quantity}
					class="h-9 w-24 text-xs"
				/>
				<Button
					variant="ghost"
					size="icon"
					disabled={items.length === 1}
					onclick={() => removeItem(index)}
					class="size-9 shrink-0 text-muted-foreground hover:text-destructive"
				>
					<Trash2 class="size-4" />
				</Button>
			</div>
		{/each}
	</div>

	<!-- Form Footer -->
	<div class="flex items-center justify-end gap-2 pt-4">
		<Button onclick={handleTransfer}>
			<PackageCheck class="mr-1.5 size-4" /> Complete Transfer
		</Button>
	</div>
</div>
