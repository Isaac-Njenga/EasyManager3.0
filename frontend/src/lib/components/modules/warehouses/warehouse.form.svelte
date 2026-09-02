<script lang="ts">
	import type {
		Warehouse,
		WarehouseStatus,
		CreateWarehouseInput
	} from '$lib/types/warehouse.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	import WarehouseIcon from '@lucide/svelte/icons/warehouse';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import FileText from '@lucide/svelte/icons/file-text';

	type Props = {
		warehouse?: Warehouse;
		onSubmit: (payload: CreateWarehouseInput) => Promise<void> | void;
		isSubmitting?: boolean;
	};

	let { warehouse, onSubmit, isSubmitting = false }: Props = $props();

	// --- Status Select Options ---
	const statusOptions: { value: WarehouseStatus; label: string }[] = [
		{ value: 'Active', label: 'Active' },
		{ value: 'Inactive', label: 'Inactive' },
		{ value: 'Under Maintenance', label: 'Under Maintenance' },
		{ value: 'Full Capacity', label: 'Full Capacity' }
	];

	// --- Form State ---
	let name = $state('');
	let status = $state<WarehouseStatus>('Active');
	let building = $state('');
	let city = $state('');
	let notes = $state('');

	let errors = $state<Record<string, string>>({});

	$effect(() => {
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

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) newErrors.name = 'Warehouse name is required';
		if (!building.trim()) newErrors.building = 'Building address is required';
		if (!city.trim()) newErrors.city = 'City is required';

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!validate()) return;

		const payload: CreateWarehouseInput = {
			name: name.trim(),
			status,
			address: { building: building.trim(), city: city.trim() },
			...(notes.trim() ? { notes: notes.trim() } : {})
		};

		await onSubmit(payload);
	}
</script>

<div class="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
	<form onsubmit={handleFormSubmit} class="space-y-6">
		<!-- Section 1: Basic Information -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<WarehouseIcon class="size-4 text-primary" /> General
			</h3>
			<Separator />

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- Warehouse Name -->
				<div class="space-y-1 sm:col-span-2">
					<Label for="name">
						Warehouse Name <span class="text-destructive">*</span>
					</Label>
					<Input
						id="name"
						bind:value={name}
						required
						aria-invalid={!!errors.name}
					/>{#if errors.name}
						<p class="text-xs text-destructive">{errors.name}</p>
					{/if}
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
						type="text"
						bind:value={building}
						aria-invalid={!!errors.building}
					/>{#if errors.building}
						<p class="text-xs text-destructive">{errors.building}</p>
					{/if}
				</div>

				<!-- City -->
				<div class="space-y-1 sm:col-span-2">
					<Label for="city">
						City/Town <span class="text-destructive">*</span>
					</Label>
					<Input
						id="city"
						bind:value={city}
						required
						aria-invalid={!!errors.city}
					/>{#if errors.city}
						<p class="text-xs text-destructive">{errors.city}</p>
					{/if}
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
