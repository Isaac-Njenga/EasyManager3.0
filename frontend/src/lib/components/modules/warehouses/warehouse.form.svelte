<script lang="ts">
	import type { Warehouse, WarehouseStatus } from '$lib/types/warehouse.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	import WarehouseIcon from '@lucide/svelte/icons/warehouse';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import FileText from '@lucide/svelte/icons/file-text';
	import { toast } from 'svelte-sonner';

	type Props = {
		warehouse?: Warehouse;
	};

	let { warehouse }: Props = $props();

	// --- Status Select Options ---
	const statusOptions: { value: WarehouseStatus; label: string }[] = [
		{ value: 'Active', label: 'Active' },
		{ value: 'Inactive', label: 'Inactive' },
		{ value: 'Under Maintenance', label: 'Under Maintenance' },
		{ value: 'Full Capacity', label: 'Full Capacity' }
	];

	// --- Form State ---
    //eslint-disable-next-line
	let warehouseCode = $state('');
	let name = $state('');
	let status = $state<WarehouseStatus>('Active');
	let building = $state('');
	let city = $state('');
	let notes = $state('');

	let isSubmitting = $state(false);

	$effect(() => {
		warehouseCode = warehouse?.warehouseCode ?? '';
		name = warehouse?.name ?? '';
		status = warehouse?.status ?? 'Active';
		building = warehouse?.address?.building ?? '';
		city = warehouse?.address?.city ?? '';
		notes = warehouse?.notes ?? '';
	});

	// --- Derived Select Label ---
	const statusTriggerContent = $derived(
		statusOptions.find((s) => s.value === status)?.label ?? 'Select status'
	);

	// --- Form Submission ---
	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const requiredFields = [
			{ name: 'Warehouse Name', value: name },
			{ name: 'City', value: city }
		];

		const missing = requiredFields.filter((f) => !f.value?.toString().trim());

		if (missing.length > 0) {
			toast.warning('Please fill in required fields', {
				description: `Missing: ${missing.map((m) => m.name).join(', ')}`
			});
			return;
		}

		isSubmitting = true;

		const payload: Partial<Warehouse> = {
			...warehouse,
			warehouseCode: warehouse?.warehouseCode
				? warehouse?.warehouseCode
				: `WH-NRB-${Math.floor(100 + Math.random() * 900)}`,
			name: name.trim(),
			status,
			address: {
				building: building.trim() || undefined,
				city: city.trim()
			},
			notes: notes.trim() || undefined
		};

		console.log('Warehouse Saved:', payload);

		toast.success(warehouse ? 'Warehouse details updated!' : 'Warehouse details saved!');
		isSubmitting = false;
	}
</script>

<div class="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Section 1: Basic Information -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<WarehouseIcon class="size-4 text-primary" /> General 
			</h3>
			<Separator />

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2" >
				<!-- Warehouse Name -->
				<div class="space-y-1 sm:col-span-2">
					<Label for="name">
						Warehouse Name <span class="text-destructive">*</span>
					</Label>
					<Input
						id="name"
						bind:value={name}
						required
					/>
				</div>

							<!-- Status -->
				<div class="space-y-1">
					<Label>
						Status <span class="text-destructive">*</span>
					</Label>
					<Select.Root type="single" name="status" bind:value={status}>
						<Select.Trigger
							class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
						>
							{statusTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each statusOptions as s (s.value)}
									<Select.Item value={s.value} label={s.label}>
										{s.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>

		<!-- Section 2: Address / Location Details -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<MapPin class="size-4 text-primary" /> Location & Address
			</h3>
			<Separator />

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- Building / Zone -->
				<div class="space-y-1 sm:col-span-2">
					<Label for="building">Building/Godown</Label>
					<Input
						id="building"
						bind:value={building}
					/>
				</div>

				<!-- City -->
				<div class="space-y-1 sm:col-span-2">
					<Label for="city">
						City/Town <span class="text-destructive">*</span>
					</Label>
					<Input id="city" bind:value={city} required />
				</div>
			</div>
		</div>

		<!-- Section 3: Remarks & Notes -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<FileText class="size-4 text-primary" />Internal Notes
			</h3>
			<Separator />

			<div class="space-y-1">
				<Label for="notes">Notes</Label>
				<Textarea
					id="notes"
					placeholder="Operational notes, issues or maintenance logs..."
					bind:value={notes}
					class="h-20"
				/>
			</div>
		</div>

		<!-- Form Actions -->
		<div class="flex items-center justify-end gap-3 pt-2">
			<Button type="button" variant="outline" href="/warehouses">Cancel</Button>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Saving...' : warehouse ? 'Update Warehouse' : 'Create Warehouse'}
			</Button>
		</div>
	</form>
</div>
