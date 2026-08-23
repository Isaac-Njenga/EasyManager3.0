<script lang="ts">
	import type { Shop, ShopType, ShopStatus } from '$lib/types/shop.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	import Store from '@lucide/svelte/icons/store';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import FileText from '@lucide/svelte/icons/file-text';
	import { toast } from 'svelte-sonner';

	type Props = {
		shop?: Shop;
	};

	let { shop }: Props = $props();

	// --- Select Options ---
	const typeOptions: { value: ShopType; label: string }[] = [
		{ value: 'Retail Store', label: 'Retail Store' },
		{ value: 'Showroom', label: 'Showroom' }
	];

	const statusOptions: { value: ShopStatus; label: string }[] = [
		{ value: 'Active', label: 'Active' },
		{ value: 'Inactive', label: 'Inactive' },
		{ value: 'Under Maintenance', label: 'Under Maintenance' }
	];

	// --- Form State ---
	let shopCode = $state('');
	let name = $state('');
	let type = $state<ShopType>('Retail Store');
	let status = $state<ShopStatus>('Active');
	let building = $state('');
	let town = $state('');
	let notes = $state('');

	let isSubmitting = $state(false);

	$effect(() => {
		shopCode = shop?.shopCode ?? '';
		name = shop?.name ?? '';
		type = shop?.type ?? 'Retail Store';
		status = shop?.status ?? 'Active';
		building = shop?.address?.building ?? '';
		town = shop?.address?.town ?? '';
		notes = shop?.notes ?? '';
	});

	// --- Derived Select Triggers ---
	const typeTriggerContent = $derived(
		typeOptions.find((t) => t.value === type)?.label ?? 'Select type'
	);

	const statusTriggerContent = $derived(
		statusOptions.find((s) => s.value === status)?.label ?? 'Select status'
	);

	// --- Form Submission ---
	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const requiredFields = [
			{ name: 'Shop Name', value: name },
			{ name: 'Town/City', value: town }
		];

		const missing = requiredFields.filter((f) => !f.value?.toString().trim());

		if (missing.length > 0) {
			toast.warning('Please fill in required fields', {
				description: `Missing: ${missing.map((m) => m.name).join(', ')}`
			});
			return;
		}

		isSubmitting = true;

		const payload: Partial<Shop> = {
			...shop,
			shopCode: shop?.shopCode ? shop?.shopCode : `SHP-NRB-${Math.floor(100 + Math.random() * 900)}`,
			name: name.trim(),
			type,
			status,
			address: {
				building: building.trim() || undefined,
				town: town.trim()
			},
			notes: notes.trim() || undefined
		};

		console.log('Shop Saved:', payload);

		toast.success(shop ? 'Shop Saved!' : 'Shop Created!');
		isSubmitting = false;
	}
</script>

<div class="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
	<form onsubmit={handleSubmit} novalidate class="space-y-6">
		<!-- Section 1: Basic Information -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<Store class="size-4 text-primary" /> General Profile
			</h3>
			<Separator />

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- Shop Name -->
				<div class="space-y-1 sm:col-span-2">
					<Label for="name">
						Shop Name <span class="text-destructive">*</span>
					</Label>
					<Input id="name" bind:value={name} required />
				</div>

				<!-- Shop Type -->
				<div class="space-y-1">
					<Label>
						Shop Type <span class="text-destructive">*</span>
					</Label>
					<Select.Root type="single" name="type" bind:value={type}>
						<Select.Trigger
							class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
						>
							{typeTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each typeOptions as t (t.value)}
									<Select.Item value={t.value} label={t.label}>
										{t.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Shop Status -->
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
				<!-- Building / Street -->
				<div class="space-y-1 sm:col-span-2">
					<Label for="building">Building</Label>
					<Input id="building" bind:value={building} />
				</div>

				<!-- Town -->
				<div class="space-y-1 sm:col-span-2">
					<Label for="town">
						Town / City <span class="text-destructive">*</span>
					</Label>
					<Input id="town" bind:value={town} required />
				</div>
			</div>
		</div>

		<!-- Section 3: Notes -->
		<div class="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase"
			>
				<FileText class="size-4 text-primary" /> Internal Notes
			</h3>
			<Separator />

			<div class="space-y-1">
				<Label for="notes">Notes</Label>
				<Textarea
					id="notes"
					placeholder="Add operational notes, opening hours, or manager assignments..."
					bind:value={notes}
					class="h-20"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center justify-end gap-3 pt-2">
			<Button type="button" variant="outline" href="/shops">Cancel</Button>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Saving...' : shop ? 'Update Shop' : 'Create Shop'}
			</Button>
		</div>
	</form>
</div>
