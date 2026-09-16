<script lang="ts">
	import type {
		SalespersonStatus,
		SalespersonAccountPayload
	} from '$lib/services/salesperson/salesperson.types';
	import type { Shop } from '$lib/services/shop/shop.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';

	import User from '@lucide/svelte/icons/user';
	import Store from '@lucide/svelte/icons/store';
	import Calendar from '@lucide/svelte/icons/calendar';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';

	type Props = {
		shops: Shop[];
		onSubmit: (payload: SalespersonAccountPayload) => Promise<void> | void;
		isSubmitting?: boolean;
	};

	let { shops, onSubmit, isSubmitting = false }: Props = $props();

	// Mapped shop options
	$effect(() => {
		if (!shops || shops.length === 0) {
			console.warn('No shops provided to SalepersonForm component.');
		}
	});

	const shopOptions = $derived(
		shops?.map((s: Shop) => ({
			value: s._id,
			label: `${s.name} - ${s.address.town}`
		}))
	);

	// Form reactive state - Salesperson Domain
	let firstName = $state('');
	let lastName = $state('');
	let status = $state<SalespersonStatus>('Active');
	let assignedShop = $state<string>('');
	let hireDate = $state<string>(new Date().toISOString().split('T')[0]);

	// Form reactive state - Account & Auth Domain (Backend only)
	let userId = $state('');
	let password = $state('');
	let isActivated = $state(true);
	let confirmPassword = $state('');
	let role = $state<'SALESPERSON' | 'SUPER_ADMIN'>('SALESPERSON');
	let showPassword = $state(false);

	let errors = $state<Record<string, string>>({});

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!firstName.trim()) newErrors.firstName = 'First name is required';
		if (!lastName.trim()) newErrors.lastName = 'Last name is required';
		if (!assignedShop) newErrors.assignedShop = 'Please select an assigned shop';
		if (!hireDate) newErrors.hireDate = 'Hire date is required';
		if (!userId) newErrors.hireDate = 'User ID is required';

		if (!password) {
			newErrors.password = 'Initial password is required';
		} else if (password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters';
		}

		if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	const shopTriggerContent = $derived(
		shopOptions.find((shop) => shop.value === assignedShop)?.label ?? 'Select a shop...'
	);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!validate()) return;

		const selectedShop = shops.find((s) => s._id === assignedShop);

		const payload: SalespersonAccountPayload = {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			status,
			assignedShop: selectedShop ? selectedShop._id : '',
			hireDate,
			userId,
			role,
			password,
			isActivated
		};

		await onSubmit(payload);
	}
</script>

<div class="m-auto w-180 rounded-xl border bg-card p-5 shadow-sm">
	<form onsubmit={handleSubmit} novalidate class="space-y-6">
		<!-- Section 1: Personal Details -->
		<div class="space-y-4">
			<div class="flex items-center gap-2 text-sm font-semibold text-foreground">
				<User class="size-4 text-primary" />
				<span>Personal Information</span>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- First Name -->
				<div class="space-y-2">
					<Label for="firstName">First Name <span class="text-destructive">*</span></Label>
					<Input
						id="firstName"
						type="text"
						placeholder="e.g. John"
						bind:value={firstName}
						aria-invalid={!!errors.firstName}
					/>
					{#if errors.firstName}
						<p class="text-xs text-destructive">{errors.firstName}</p>
					{/if}
				</div>

				<!-- Last Name -->
				<div class="space-y-2">
					<Label for="lastName">Last Name <span class="text-destructive">*</span></Label>
					<Input
						id="lastName"
						type="text"
						placeholder="e.g. Doe"
						bind:value={lastName}
						aria-invalid={!!errors.lastName}
					/>
					{#if errors.lastName}
						<p class="text-xs text-destructive">{errors.lastName}</p>
					{/if}
				</div>
			</div>
		</div>

		<Separator />

		<!-- Section 2: User Account & Authentication Credentials -->
		<div class="space-y-4">
			<div class="flex items-center gap-2 text-sm font-semibold text-foreground">
				<KeyRound class="size-4 text-primary" />
				<span>Account Credentials</span>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- System Email -->
				<div class="space-y-2">
					<Label for="email">User ID</Label>
					<Input
						id="userId"
						type="text"
						// placeholder="sales.john@store.co.ke"
						bind:value={userId}
						aria-invalid={!!errors.userId}
					/>
					{#if errors.userId}
						<p class="text-xs text-destructive">{errors.userId}</p>
					{/if}
				</div>

				<!-- System Role -->
				<div class="space-y-2">
					<Label for="role">System Role</Label>
					<Input value="salesperson" disabled />
				</div>

				<!-- Password -->
				<div class="space-y-2">
					<Label for="password">Account Password</Label>
					<div class="relative">
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="••••••••"
							bind:value={password}
							aria-invalid={!!errors.password}
							class="pr-10"
						/>
						<button
							type="button"
							class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff class="size-4" />
							{:else}
								<Eye class="size-4" />
							{/if}
						</button>
					</div>
					{#if errors.password}
						<p class="text-xs text-destructive">{errors.password}</p>
					{/if}
				</div>

				<!-- Confirm Password -->
				<div class="space-y-2">
					<Label for="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						type={showPassword ? 'text' : 'password'}
						placeholder="••••••••"
						bind:value={confirmPassword}
						aria-invalid={!!errors.confirmPassword}
					/>
					{#if errors.confirmPassword}
						<p class="text-xs text-destructive">{errors.confirmPassword}</p>
					{/if}
				</div>
			</div>
		</div>

		<Separator />

		<!-- Section 3: Assignment & Employment -->
		<div class="space-y-4">
			<div class="flex items-center gap-2 text-sm font-semibold text-foreground">
				<Store class="size-4 text-primary" />
				<span>Branch & Status</span>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- Assigned Shop -->
				<div class="space-y-2">
					<Label for="assignedShop">Assigned Shop <span class="text-destructive">*</span></Label>
					<Select.Root
						type="single"
						value={assignedShop}
						onValueChange={(val) => (assignedShop = val)}
					>
						<Select.Trigger id="assignedShop" class="w-full">
							{shopTriggerContent}
						</Select.Trigger>
						<Select.Content>
							{#each shopOptions as shop (shop.value)}
								<Select.Item value={shop.value} label={shop.label}>
									<span class="font-medium">{shop.label}</span>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if errors.assignedShopId}
						<p class="text-xs text-destructive">{errors.assignedShopId}</p>
					{/if}
				</div>

				<!-- Status -->
				<div class="space-y-2">
					<Label for="status">Status</Label>
					<Select.Root
						type="single"
						value={status}
						onValueChange={(val) => (status = val as SalespersonStatus)}
					>
						<Select.Trigger id="status" class="w-full">
							{status}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="Active" label="Active" />
							<Select.Item value="Inactive" label="Inactive" />
							<Select.Item value="Terminated" label="Terminated" />
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>

		<Separator />

		<!-- Section 4: Dates -->
		<div class="space-y-4">
			<div class="flex items-center gap-2 text-sm font-semibold text-foreground">
				<Calendar class="size-4 text-primary" />
				<span>Employment Dates</span>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- Hire Date -->
				<div class="space-y-2">
					<Label for="hireDate">Hire Date <span class="text-destructive">*</span></Label>
					<Input id="hireDate" type="date" bind:value={hireDate} aria-invalid={!!errors.hireDate} />
					{#if errors.hireDate}
						<p class="text-xs text-destructive">{errors.hireDate}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Actions Footer -->
		<div class="flex items-center justify-end gap-3 pt-4">
			<Button type="button" variant="outline" href="/salespersons" disabled={isSubmitting}>
				Cancel
			</Button>

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Saving...' : 'Create Salesperson'}
			</Button>
		</div>
	</form>
</div>
