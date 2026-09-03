<script lang="ts">
	import type { Product } from '$lib/services/product/product.types';
	import type {
		Sale,
		SaleItem,
		CreateSaleItem,
		PaymentMethod,
		PaymentStatus,
		SaleStatus,
		CreateSaleInput
	} from '$lib/services/sales/sales.types';
	import type { Shop } from '$lib/services/shop/shop.types';

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
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	// import { shopsData } from '$lib/data/shop.data';
	import { formatCurrency } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import type { Salesperson } from '$lib/services/salesperson/salesperson.types';

	type Props = {
		products?: Product[];
		sale?: Sale;
		shops?: Shop[];
		salespersons?: Salesperson[];
		onSubmit: (payload: CreateSaleInput) => Promise<void> | void;
		isSubmitting?: boolean;
	};

	let { products, sale, shops, salespersons, onSubmit, isSubmitting = false }: Props = $props();

	$effect(() => {
		console.log(products);
		if (!products || products.length === 0 || !salespersons || salespersons.length === 0) {
			console.warn('No shops provided to SalepersonForm component.');
		}
	});

	const paymentStatusOptions = [
		{ value: 'Paid', label: 'Paid' },
		{ value: 'Pending', label: 'Pending' },
		{ value: 'Partially Paid', label: 'Partially Paid' }
	];

	const salepersonOptions = $derived(
		salespersons?.map((sp) => ({
			value: sp._id,
			label: `${sp.firstName} ${sp.lastName}`
		}))
	);

	const paymentOptions = [
		{ value: 'Cash', label: 'Cash' },
		{ value: 'M-Pesa', label: 'M-Pesa' },
		{ value: 'Credit Card', label: 'Credit Card' },
		{ value: 'Bank Transfer', label: 'Bank Transfer' }
	];

	let searchQuery = $state('');
	let isProductSearchOpen = $state(false);
	let selectedItems = $state<SaleItem[]>([]);

	let customerName = $state('');
	let customerPhone = $state('');
	let customerEmail = $state('');

	let paymentMethod = $state<PaymentMethod>('Cash');
	let paymentStatus = $state<PaymentStatus>('Paid');
	let saleStatus = $state<SaleStatus>('Completed');
	let saleperson = $state<string>('');
	let dateOfSale = $state(new Date().toISOString().split('T')[0]);
	let notes = $state('');
	let loadedImageIds = $state<string[]>([]);

	let errors = $state<Record<string, string>>({});

	$effect(() => {
		selectedItems = sale?.items ?? [];
		customerName = sale?.customer?.name ?? '';
		customerPhone = sale?.customer?.phone ?? '';
		customerEmail = sale?.customer?.email ?? '';

		paymentMethod = sale?.paymentMethod ?? 'Cash';
		paymentStatus = sale?.paymentStatus ?? 'Paid';
		saleStatus = sale?.status ?? 'Completed';
		saleperson = sale?.saleperson?._id ?? '';
		dateOfSale = sale?.dateOfSale ?? new Date().toISOString().split('T')[0];
		notes = sale?.notes ?? '';
	});

	// --- Select Trigger Labels ---
	const paymentStatusTriggerContent = $derived(
		paymentStatusOptions.find((pStatus) => pStatus.value === paymentStatus)?.label ??
			'Select status'
	);

	const salepersonTriggerContent = $derived(
		salepersonOptions?.find((sp) => sp.value === saleperson)?.label ?? 'Select salesperson'
	);

	const paymentTriggerContent = $derived(
		paymentOptions.find((pay) => pay.value === paymentMethod)?.label ?? 'Select method'
	);

	// --- Derived Calculations ---
	// All products loaded, filtered dynamically if search text is typed
	let filteredProducts = $derived(
		products?.filter((p) => {
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
		selectedItems.reduce(
			(acc, item) => acc + (item.soldPrice ?? item.product.sellingPrice) * item.quantity,
			0
		)
	);

	let discountTotal = $derived(
		selectedItems.reduce((acc, item) => acc + Number(item.discount || 0), 0)
	);

	let grandTotal = $derived(subTotal - discountTotal);

	let commission = $derived(subTotal > 10000 ? subTotal * 0.1 : 0);

	function getShopStock(product: Product, shopId: string) {
		const directStock = (product.inventoryDistribution ?? product.inventory ?? []).filter(
			(stock) => stock.locationType === 'Shop' && stock.locationId === shopId
		);
		if (directStock.length > 0) {
			return directStock.reduce((total, stock) => total + stock.quantity, 0);
		}

		const shopProduct = shops
			?.find((shop) => shop._id === shopId)
			?.inventoryItems?.find((item) => item._id === product._id);
		return (shopProduct?.inventory ?? [])
			.filter((stock) => stock.locationType === 'Shop')
			.reduce((total, stock) => total + stock.quantity, 0);
	}

	function getItemShopStock(item: SaleItem, shopId: string) {
		const product = products?.find((candidate) => candidate._id === item.product._id);
		return getShopStock(product ?? ({} as Product), shopId);
	}

	function selectShop(item: SaleItem, shopId: string | undefined) {
		const shop = shops?.find((candidate) => candidate._id === shopId);
		if (!shop) return;
		selectedItems = selectedItems.map((candidate) =>
			candidate.product._id === item.product._id ? { ...candidate, shop } : candidate
		);
	}

	function markImageLoaded(productId: string) {
		if (!loadedImageIds.includes(productId)) loadedImageIds = [...loadedImageIds, productId];
	}

	// --- Actions ---
	function addProductToSale(product: Product) {
		const existingIndex = selectedItems.findIndex((i) => i.product._id === product._id);

		if (existingIndex > -1) {
			updateItem(existingIndex, {
				quantity: selectedItems[existingIndex].quantity + 1
			});
		} else {
			const newItem: SaleItem = {
				product,
				quantity: 1,
				soldPrice: product.sellingPrice,
				shop: {} as Shop,
				discount: 0,
				totalPrice: product.sellingPrice
			};
			selectedItems = [...selectedItems, newItem];
		}
		searchQuery = '';
	}

	function updateItem(index: number, changes: Partial<SaleItem>) {
		selectedItems = selectedItems.map((item, itemIndex) => {
			if (itemIndex !== index) return item;
			const updatedItem = { ...item, ...changes };
			updatedItem.totalPrice = Math.max(
				0,
				(updatedItem.soldPrice ?? updatedItem.product.sellingPrice ?? 0) *
					(updatedItem.quantity || 1) -
					(updatedItem.discount || 0)
			);
			return updatedItem;
		});
	}

	function removeItem(index: number) {
		selectedItems = selectedItems.filter((_, itemIndex) => itemIndex !== index);
	}

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!paymentMethod.trim()) newErrors.paymentMethod = 'Payment method is required';
		if (!paymentStatus.trim()) newErrors.paymentStatus = 'Payment status is required';
		if (!saleperson.trim()) newErrors.salepersonId = 'Salesperson is required';
		if (!saleStatus.trim()) newErrors.saleStatus = 'Status is required';
		if (!dateOfSale.trim()) newErrors.dateOfSale = 'Date of Sale is required';

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleFormSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!validate()) return;

		const rawItems: CreateSaleItem[] = $state.snapshot(selectedItems).map((item) => ({
			product: item.product._id,
			quantity: item.quantity,
			soldPrice: item.soldPrice ?? item.product.sellingPrice,
			shop: item.shop?._id ?? '',
			netProfit: item.netProfit,
			netLoss: item.netLoss,
			discount: item.discount,
			subTotal: item.totalPrice
		}));

		if (selectedItems.length === 0) {
			toast.warning('Please add at least one item to the sale.');
			return;
		}

		const selectedSalesperson = salespersons?.find((s) => s._id === saleperson);

		const payload: CreateSaleInput = {
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
			commission,
			saleperson: selectedSalesperson ? selectedSalesperson._id : '',
			notes: notes || undefined
		};

		await onSubmit(payload);
	}
</script>

<div class="m-auto w-220 rounded-xl border bg-card p-5 shadow-sm">
	<form onsubmit={handleFormSubmit} class="space-y-6">
		<!-- LEFT PANEL: Item Selection & Line Items (7 Cols) -->
		<div class="space-y-6 lg:col-span-8">
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
							<span>Available Products ({filteredProducts?.length})</span>
							<button
								type="button"
								class="text-xs hover:underline"
								onclick={() => (isProductSearchOpen = false)}
							>
								Close
							</button>
						</div>

						{#if filteredProducts?.length === 0}
							<p class="p-3 text-center text-xs text-muted-foreground">No active products found.</p>
						{:else}
							{#each filteredProducts as product (product._id)}
								<button
									type="button"
									class="flex w-full cursor-pointer items-center justify-between rounded-sm p-2 text-left hover:bg-accent"
									onclick={() => {
										addProductToSale(product);
										isProductSearchOpen = false;
									}}
								>
									<div class="flex items-center gap-3">
										{#if product.image?.[0]}
											<div class="relative size-9 shrink-0">
												{#if !loadedImageIds.includes(product._id)}
													<Loader2
														class="absolute inset-0 m-auto size-4 animate-spin text-muted-foreground"
													/>
												{/if}
												<img
													src={product.image[0]}
													alt={product.name}
													loading="lazy"
													decoding="async"
													onload={() => markImageLoaded(product._id)}
													onerror={() => markImageLoaded(product._id)}
													class="size-9 rounded border object-cover"
												/>
											</div>
										{:else}
											<div class="flex size-9 items-center justify-center rounded border bg-muted">
												<Package class="size-4 text-muted-foreground" />
											</div>
										{/if}
										<div>
											<p class="text-xs font-semibold">{product.name}</p>
											<p class="text-[11px] text-muted-foreground">
												{product.code} | Qty: {product.totalQuantity} | Colour: {product.colour}
											</p>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<span class="text-xs font-bold">{formatCurrency(product.sellingPrice)}</span>
										<Plus class="size-4 text-muted-foreground" />
									</div>
								</button>
								<Separator class="my-1" />
							{/each}
						{/if}
					</div>
				{/if}
			</div>

			<!-- Selected Items Cart Table -->
			<div class="rounded-lg border bg-card p-2 shadow-sm">
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
					<div class="space-y-2">
						{#each selectedItems as item, index (item.product._id)}
							<div
								class="flex flex-col gap-2 rounded-md border p-2 text-xs sm:flex-row sm:items-center sm:justify-between"
							>
								<!-- Item Identity -->
								<div class="flex-1 space-y-0.5">
									<p class="font-semibold text-foreground">{item.product.name}</p>
									<p class="text-11px] text-muted-foreground">
										{item.product.code} | {item.product.colour}
									</p>
								</div>

								<!-- Fulfillment shop -->

								<!-- Controls: Negotiated Price, Quantity, Line Discount, Line Total -->
								<div class="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
									<div class="w-50">
										<Label class="mb-1 text-[11px] font-bold">Selling Shop</Label>
										<Select.Root
											type="single"
											value={item.shop?._id}
											onValueChange={(shopId) => selectShop(item, shopId)}
										>
											<Select.Trigger
												class="flex h-8 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm"
											>
												{item.shop?.name ?? 'Select shop'}
											</Select.Trigger>
											<Select.Content>
												<Select.Group>
													{#each shops as shop (shop._id)}
														<Select.Item value={shop._id} label={shop.name}>
															{shop.name} - ({getItemShopStock(item, shop._id)} available)
														</Select.Item>
													{/each}
												</Select.Group>
											</Select.Content>
										</Select.Root>
									</div>
									<!-- Editable Selling Price -->
									<div class="w-24">
										<Label class="mb-1 text-[11px] font-bold">Unit Price</Label>
										<Input
											type="number"
											min="0"
											step="any"
											value={item.soldPrice ?? item.product.sellingPrice}
											oninput={(event) =>
												updateItem(index, {
													soldPrice: Number((event.currentTarget as HTMLInputElement).value)
												})}
											class="h-8 text-xs"
										/>
									</div>

									<!-- Quantity -->
									<div class="w-15">
										<Label class="mb-1 text-[11px] font-bold">Qty</Label>
										<Input
											type="number"
											min="1"
											value={item.quantity}
											oninput={(event) =>
												updateItem(index, {
													quantity: Number((event.currentTarget as HTMLInputElement).value)
												})}
											class="h-8 text-xs"
										/>
									</div>

									<!-- Line Discount -->
									<div class="w-15">
										<Label class="mb-1 text-[11px] font-bold">Discount</Label>
										<Input
											type="number"
											min="0"
											value={item.discount}
											oninput={(event) =>
												updateItem(index, {
													discount: Number((event.currentTarget as HTMLInputElement).value)
												})}
											class="h-8 text-xs"
										/>
									</div>

									<!-- Line Total -->
									<!-- <div class="w-20">
									<Label class="mb-1 text-[11px]">Total</Label>
									<Input
										type="number"
										min="0"
										// bind:value={item.total}
										oninput={() => recalculateItemTotal(index)}
										class="h-8 text-xs"
									/>
								</div> -->

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
		<div class="space-y-6 lg:col-span-4">
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
						<Input
							id="sale-date"
							type="date"
							bind:value={dateOfSale}
							required
							aria-invalid={!!errors.dateOfSale}
						/>
						{#if errors.dateOfSale}
							<p class="mt-1 text-xs text-destructive">{errors.dateOfSale}</p>
						{/if}
					</div>

					<!-- Salesperson -->
					<div class="space-y-1">
						<Label>
							Salesperson <span class="text-destructive">*</span>
						</Label>
						<Select.Root
							type="single"
							name="saleperson"
							value={saleperson}
							onValueChange={(val) => (saleperson = val)}
							required
						>
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
						{#if errors.salepersonId}
							<p class="mt-1 text-xs text-destructive">{errors.salepersonId}</p>
						{/if}
					</div>

					<!-- Payment Method -->
					<div class="space-y-1">
						<Label>
							Payment Method <span class="text-destructive">*</span>
						</Label>
						<Select.Root type="single" name="paymentMethod" bind:value={paymentMethod} required>
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
						{#if errors.paymentMethod}
							<p class="mt-1 text-xs text-destructive">{errors.paymentMethod}</p>
						{/if}
					</div>

					<!-- Payment Status -->
					<div class="space-y-1">
						<Label>
							Payment Status <span class="text-destructive">*</span>
						</Label>
						<Select.Root type="single" name="paymentStatus" bind:value={paymentStatus} required>
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
						</Select.Root>{#if errors.paymentStatus}
							<p class="mt-1 text-xs text-destructive">{errors.paymentStatus}</p>
						{/if}
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
				<div class="space-y-1.5 text-xs">
					<div class="flex justify-between text-muted-foreground">
						<span>Subtotal</span>
						<span>{formatCurrency(subTotal)}</span>
					</div>
					{#if commission > 0}
						<div class="flex justify-between text-rose-500">
							<span>Sale Commission</span>
							<span>-{formatCurrency(commission)}</span>
						</div>
					{/if}
					{#if discountTotal > 0}
						<div class="flex justify-between text-orange-500">
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
</div>
