<script lang="ts">
	import type { Product } from '$lib/types/product.types';
	import type {
		Sale,
		SaleItem,
		PaymentMethod,
		PaymentStatus,
		SaleStatus
	} from '$lib/types/sale.types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	import Search from '@lucide/svelte/icons/search';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
	import Package from '@lucide/svelte/icons/package';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import { productsData } from '$lib/data/products.data';
	import { formatCurrency } from '$lib/components/modules/sales/sales.columns';
	import { toast } from 'svelte-sonner';

	const paymentStatusOptions = [
		{ value: 'Paid', label: 'Paid' },
		{ value: 'Pending', label: 'Pending' },
		{ value: 'Partially Paid', label: 'Partially Paid' }
	];

	const salepersonOptions = [
		{ value: 'John Doe', label: 'John Doe' },
		{ value: 'Jane Doe', label: 'Jane Doe' }
	];

	const paymentOptions = [
		{ value: 'Cash', label: 'Cash' },
		{ value: 'M-Pesa', label: 'M-Pesa' },
		{ value: 'Credit Card', label: 'Credit Card' },
		{ value: 'Bank Transfer', label: 'Bank Transfer' }
	];

	type Props = {
		products?: Product[];
		sale?: Sale;
	};

	let { products = productsData, sale }: Props = $props();

	// --- Form Reactive State ---
	let searchQuery = $state('');
	let isProductSearchOpen = $state(false);
	let selectedItems = $state<SaleItem[]>([]);

	let customerName = $state('');
	let customerPhone = $state('');
	let customerEmail = $state('');

	let paymentMethod = $state<PaymentMethod>('Cash');
	let paymentStatus = $state<PaymentStatus>('Paid');
	let saleStatus = $state<SaleStatus>('Completed');
	let saleperson = $state('');
	let dateOfSale = $state(new Date().toISOString().split('T')[0]);
	let notes = $state('');

	const requiredFieldsConfig = [
		{ label: 'Payment Method', getValue: () => paymentMethod },
		{ label: 'Payment Status', getValue: () => paymentStatus },
		{ label: 'Salesperson', getValue: () => saleperson },
		{ label: 'Sale Status', getValue: () => saleStatus },
		{ label: 'Date of Sale', getValue: () => dateOfSale }
	];

	$effect(() => {
		selectedItems = sale?.items ?? [];
		customerName = sale?.customer?.name ?? '';
		customerPhone = sale?.customer?.phone ?? '';
		customerEmail = sale?.customer?.email ?? '';

		paymentMethod = sale?.paymentMethod ?? 'Cash';
		paymentStatus = sale?.paymentStatus ?? 'Paid';
		saleStatus = sale?.status ?? 'Completed';
		saleperson = sale?.saleperson ?? '';
		dateOfSale = sale?.dateOfSale ?? new Date().toISOString().split('T')[0];
		notes = sale?.notes ?? '';
	});

	let isSubmitting = $state(false);

	// --- Select Trigger Labels ---
	const paymentStatusTriggerContent = $derived(
		paymentStatusOptions.find((pStatus) => pStatus.value === paymentStatus)?.label ??
			'Select status'
	);

	const salepersonTriggerContent = $derived(
		salepersonOptions.find((sp) => sp.value === saleperson)?.label ?? 'Select salesperson'
	);

	const paymentTriggerContent = $derived(
		paymentOptions.find((pay) => pay.value === paymentMethod)?.label ?? 'Select method'
	);

	// --- Derived Calculations ---
	// All active products loaded, filtered dynamically if search text is typed
	let filteredProducts = $derived(
		products.filter((p) => {
			const isActive = p.status === 'Active';
			if (!isActive) return false;
			if (!searchQuery.trim()) return true;

			const q = searchQuery.toLowerCase();
			return (
				p.name.toLowerCase().includes(q) ||
				p.sku.toLowerCase().includes(q) ||
				p.code.toLowerCase().includes(q)
			);
		})
	);

	let subTotal = $derived(
		selectedItems.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0)
	);

	let discountTotal = $derived(
		selectedItems.reduce((acc, item) => acc + Number(item.discount || 0), 0)
	);

	let grandTotal = $derived(subTotal - discountTotal);

	// --- Actions ---
	function addProductToSale(product: Product) {
		const existingIndex = selectedItems.findIndex((i) => i.productId === product._id);

		if (existingIndex > -1) {
			selectedItems[existingIndex].quantity += 1;
			recalculateItemTotal(existingIndex);
		} else {
			const newItem: SaleItem = {
				productId: product._id,
				productName: product.name,
				image: product.image,
				category: product.category,
				colour: product.colour,
				description: product.description,
				code: product.code,
				sku: product.sku,
				sellingPrice: product.sellingPrice,
				costPrice: product.costPrice,
				quantity: 1,
				location: product.location,
				discount: 0,
				totalPrice: product.sellingPrice
			};
			selectedItems.push(newItem);
		}
		searchQuery = '';
	}

	function recalculateItemTotal(index: number) {
		const item = selectedItems[index];
		const rawTotal = (item.sellingPrice || 0) * (item.quantity || 1);
		item.totalPrice = Math.max(0, rawTotal - (item.discount || 0));
	}

	function removeItem(index: number) {
		selectedItems.splice(index, 1);
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const rawItems = $state.snapshot(selectedItems);

		const missingFields = requiredFieldsConfig
			.filter((field) => !field.getValue()?.toString().trim())
			.map((field) => field.label);

		if (missingFields.length > 0) {
			toast.warning('Please fill in required fields', {
				description: `Missing: ${missingFields.join(', ')}`
			});
			return;
		}

		if (selectedItems.length === 0) {
			toast.warning('Please add at least one item to the sale.');
			return;
		}

		isSubmitting = true;

		const newSale: Partial<Sale> = {
			receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
			customer: {
				name: customerName || 'Walk-in Customer',
				phone: customerPhone || undefined,
				email: customerEmail || undefined
			},
			items: rawItems,
			subTotal,
			discountTotal,
			grandTotal,
			dateOfSale,
			paymentMethod,
			paymentStatus,
			status: saleStatus,
			saleperson,
			notes: notes || undefined,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		console.log('Submitting Sale:', newSale);

		toast.success('Sale Saved!');
		isSubmitting = false;
	}
</script>

<form onsubmit={handleSubmit} class="grid grid-cols-1 gap-6 lg:grid-cols-12">
	<!-- LEFT PANEL: Item Selection & Line Items (7 Cols) -->
	<div class="space-y-6 lg:col-span-7">
		<!-- Product Picker / Search Combobox -->
		<div class="space-y-2">
			<!-- <Label for="product-search" class="flex items-center gap-1">
				Select / Search Products <span class="text-destructive">*</span>
			</Label> -->
			<div class="relative">
				<Search class="absolute top-2.5 left-3 size-4 text-muted-foreground" />
				<Input
					id="product-search"
					type="search"
					placeholder="Select product..."
					bind:value={searchQuery}
					onfocus={() => (isProductSearchOpen = true)}
					class="pr-10 pl-9"
				/>
				<button
					type="button"
					onclick={() => (isProductSearchOpen = !isProductSearchOpen)}
					class="absolute top-2.5 right-3 text-muted-foreground hover:text-foreground"
				>
					<ChevronsUpDown class="size-4" />
				</button>
			</div>

			<!-- Product Search/List Dropdown -->
			{#if isProductSearchOpen}
				<div class="max-h-64 overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
					<div
						class="mb-1 flex items-center justify-between border-b px-2 py-1 text-[11px] font-semibold text-muted-foreground"
					>
						<span>Available Products ({filteredProducts.length})</span>
						<button
							type="button"
							class="text-xs hover:underline"
							onclick={() => (isProductSearchOpen = false)}
						>
							Close
						</button>
					</div>

					{#if filteredProducts.length === 0}
						<p class="p-3 text-center text-xs text-muted-foreground">No active products found.</p>
					{:else}
						{#each filteredProducts as product (product._id)}
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-sm p-2 text-left hover:bg-accent"
								onclick={() => {
									addProductToSale(product);
									isProductSearchOpen = false;
								}}
							>
								<div class="flex items-center gap-3">
									{#if product.image?.[0]}
										<img
											src={product.image[0]}
											alt={product.name}
											class="size-9 rounded border object-cover"
										/>
									{:else}
										<div class="flex size-9 items-center justify-center rounded border bg-muted">
											<Package class="size-4 text-muted-foreground" />
										</div>
									{/if}
									<div>
										<p class="text-xs font-semibold">{product.name}</p>
										<p class="text-[11px] text-muted-foreground">
											{product.code} | Stock: {product.quantity}
										</p>
									</div>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-xs font-bold">{formatCurrency(product.sellingPrice)}</span>
									<Plus class="size-4 text-muted-foreground" />
								</div>
							</button>
						{/each}
					{/if}
				</div>
			{/if}
		</div>

		<!-- Selected Items Cart Table -->
		<div class="rounded-lg border bg-card p-4 shadow-sm">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="flex items-center gap-2 text-sm font-semibold">
					<ShoppingCart class="size-4" />
					Line Items ({selectedItems.length}) <span class="text-destructive">*</span>
				</h3>
			</div>

			{#if selectedItems.length === 0}
				<div
					class="flex h-40 flex-col items-center justify-center space-y-1 text-center text-muted-foreground"
				>
					<p class="text-xs">No items added to sale yet.</p>
					<p class="text-[11px]">Click or search above to select products.</p>
				</div>
			{:else}
				<div class="space-y-3">
					{#each selectedItems as item, index (item.productId)}
						<div
							class="flex flex-col gap-3 rounded-md border p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
						>
							<!-- Item Identity -->
							<div class="flex-1 space-y-0.5">
								<p class="font-semibold text-foreground">{item.productName}</p>
								<p class="text-[11px] text-muted-foreground">
									{item.code}
								</p>
							</div>

							<!-- Controls: Negotiated Price, Quantity, Line Discount, Line Total -->
							<div class="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
								<!-- Editable Selling Price -->
								<div class="w-24">
									<Label class="mb-1 text-[11px]">Unit Price</Label>
									<Input
										type="number"
										min="0"
										step="any"
										bind:value={item.sellingPrice}
										oninput={() => recalculateItemTotal(index)}
										class="h-8 text-xs font-medium"
									/>
								</div>

								<!-- Quantity -->
								<div class="w-16">
									<Label class="mb-1 text-[11px]">Qty</Label>
									<Input
										type="number"
										min="1"
										bind:value={item.quantity}
										oninput={() => recalculateItemTotal(index)}
										class="h-8 text-xs"
									/>
								</div>

								<!-- Line Discount -->
								<div class="w-20">
									<Label class="mb-1 text-[11px]">Discount</Label>
									<Input
										type="number"
										min="0"
										bind:value={item.discount}
										oninput={() => recalculateItemTotal(index)}
										class="h-8 text-xs"
									/>
								</div>

								<!-- Line Total -->
								<div class="min-w-20 text-right">
									<Label class="mb-1 text-[11px] text-muted-foreground">Total</Label>
									<p class="pt-1 font-bold text-foreground">
										{formatCurrency(item.totalPrice)}
									</p>
								</div>

								<!-- Remove Button -->
								<Button
									type="button"
									variant="ghost"
									size="icon"
									class="size-8 self-end text-destructive"
									onclick={() => removeItem(index)}
								>
									<Trash2 class="size-4" />
								</Button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- RIGHT PANEL: Customer Info, Payment Details & Summary (5 Cols) -->
	<div class="space-y-6 lg:col-span-5">
		<!-- Payment & Status Options -->
		<div class="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
			<h3 class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
				Transaction Details
			</h3>

			<div class="grid grid-cols-2 gap-3">
				<!-- Date -->
				<div class="space-y-1">
					<Label for="sale-date">
						Date of Sale <span class="text-destructive">*</span>
					</Label>
					<Input id="sale-date" type="date" bind:value={dateOfSale} required />
				</div>

				<!-- Salesperson -->
				<div class="space-y-1">
					<Label>
						Salesperson <span class="text-destructive">*</span>
					</Label>
					<Select.Root type="single" name="saleperson" bind:value={saleperson}>
						<Select.Trigger
							class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
						>
							{salepersonTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each salepersonOptions as sp (sp.value)}
									<Select.Item value={sp.value} label={sp.label}>
										{sp.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Payment Method -->
				<div class="space-y-1">
					<Label>
						Payment Method <span class="text-destructive">*</span>
					</Label>
					<Select.Root type="single" name="paymentMethod" bind:value={paymentMethod}>
						<Select.Trigger
							class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
						>
							{paymentTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each paymentOptions as pay (pay.value)}
									<Select.Item value={pay.value} label={pay.label}>
										{pay.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Payment Status -->
				<div class="space-y-1">
					<Label>
						Payment Status <span class="text-destructive">*</span>
					</Label>
					<Select.Root type="single" name="paymentStatus" bind:value={paymentStatus}>
						<Select.Trigger
							class="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
						>
							{paymentStatusTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each paymentStatusOptions as pStatus (pStatus.value)}
									<Select.Item value={pStatus.value} label={pStatus.label}>
										{pStatus.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>

			<!-- Notes -->
			<div class="space-y-1 pt-2">
				<Label for="notes">Notes / Instructions</Label>
				<Textarea id="notes" placeholder="Optional notes..." bind:value={notes} class="h-16" />
			</div>
		</div>

		<!-- Customer Details Card -->
		<div class="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
			<h3 class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
				Customer Details (Optional)
			</h3>

			<div class="space-y-2">
				<Label for="cust-name">Customer Name</Label>
				<Input id="cust-name" placeholder="Walk-in Customer" bind:value={customerName} />
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div class="space-y-1">
					<Label for="cust-phone">Phone</Label>
					<Input id="cust-phone" placeholder="+254..." bind:value={customerPhone} />
				</div>
				<div class="space-y-1">
					<Label for="cust-email">Email</Label>
					<Input
						id="cust-email"
						type="email"
						placeholder="client@example.com"
						bind:value={customerEmail}
					/>
				</div>
			</div>
		</div>

		<!-- Financial Summary Card & Submit Button -->
		<div class="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
			<h3 class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Summary</h3>

			<div class="space-y-1.5 text-xs">
				<div class="flex justify-between text-muted-foreground">
					<span>Subtotal</span>
					<span>{formatCurrency(subTotal)}</span>
				</div>
				{#if discountTotal > 0}
					<div class="flex justify-between text-rose-500">
						<span>Total Discounts</span>
						<span>-{formatCurrency(discountTotal)}</span>
					</div>
				{/if}
				<Separator class="my-2" />
				<div class="flex justify-between text-base font-bold text-foreground">
					<span>Grand Total</span>
					<span class="text-emerald-500">{formatCurrency(grandTotal)}</span>
				</div>
			</div>

			<Button type="submit" class="w-full" disabled={isSubmitting || selectedItems.length === 0}>
				{isSubmitting ? 'Saving...' : sale ? 'Update Sale' : 'Save Sale'}
			</Button>
		</div>
	</div>
</form>
