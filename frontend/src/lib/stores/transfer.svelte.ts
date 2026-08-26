import type { Product } from '$lib/types/product.types';
import type { TransferType, TransferLocation, LocationType } from '$lib/types/transfers.types';
import { warehouseData as warehouses } from '$lib/data/warehouses.data';
import { shopsData as shops } from '$lib/data/shop.data';
import { toast } from 'svelte-sonner';

export type LocationOption = TransferLocation;

export const transferLocations: LocationOption[] = [
	...warehouses.map((warehouse) => ({
		id: warehouse._id,
		name: warehouse.name,
		type: 'warehouse' as const
	})),
	...shops.map((shop) => ({
		id: shop._id,
		name: shop.name,
		type: 'shop' as const
	}))
];

class TransferStore {
	sourceId = $state('');
	destinationId = $state('');
	items = $state<Product[]>([]);

	start(sourceId: string) {
		this.reset();
		this.sourceId = sourceId;
	}

	/**
	 * Determines transfer type based on source and destination location types
	 */
	determineTransferType(sourceType: LocationType, destType: LocationType): TransferType {
		if (sourceType === 'warehouse' && destType === 'warehouse') return 'inter_warehouse';
		if (sourceType === 'warehouse' && destType === 'shop') return 'store_replenishment';
		if (sourceType === 'shop' && destType === 'warehouse') return 'return_to_hub';
		return 'inter_shop';
	}

	addProductItem(product: Product) {
		const existingIndex = this.items.findIndex((i) => i._id === product._id);

		if (existingIndex !== -1) {
			this.items[existingIndex].totalQuantity += 1;
			toast.info(`Updated quantity for ${product.name}`);
		} else {
			this.items = [
				...this.items,
				{
					_id: product._id,
					name: product.name,
					code: product.code,
					totalQuantity: 1,
					sku: product.sku,
					colour: product.colour,
					image: product.image,
					description: product.description,
					category: product.category,
					costPrice: product.costPrice,
					sellingPrice: product.sellingPrice,
					status: product.status
				}
			];
			toast.success(`Added ${product.name} to transfer list`);
		}
	}

	removeItem(index: number) {
		this.items = this.items.filter((_, i) => i !== index);
	}

	/**
	 * Handles transfer submission. Returns true on success to allow modal/drawer closing.
	 */
	handleTransfer(): boolean {
		if (!this.sourceId || !this.destinationId) {
			toast.warning('Please select both source and destination locations.');
			return false;
		}

		if (this.sourceId === this.destinationId) {
			toast.warning('Source and destination locations must be different.');
			return false;
		}

		if (this.items.length === 0) {
			toast.warning('Please select at least one item to transfer.');
			return false;
		}

		const validItems = this.items.filter((i) => i.name.trim() && i.totalQuantity > 0);
		if (validItems.length === 0) {
			toast.warning('Please ensure all items have valid quantities.');
			return false;
		}

		const sourceLoc = transferLocations.find((location) => location.id === this.sourceId);
		const destLoc = transferLocations.find((location) => location.id === this.destinationId);

		if (!sourceLoc || !destLoc) {
			toast.error('Invalid location selection.');
			return false;
		}

		const type = this.determineTransferType(sourceLoc.type, destLoc.type);

		const payload = {
			transferNumber: `TRN-${Math.floor(1000 + Math.random() * 9000)}`,
			type,
			source: sourceLoc,
			destination: destLoc,
			items: validItems,
			totalItemsCount: validItems.reduce((total, item) => total + item.totalQuantity, 0),
			date: new Date().toISOString(),
			notes: ''
		};

		console.log('Transfer Payload:', payload);

		toast.success('Transfer Initiated!', {
			description: `Moving ${validItems.length} item(s) from ${sourceLoc.name} to ${destLoc.name}.`
		});

		// Reset state
		this.reset();
		return true;
	}

	reset() {
		this.items = [];
		this.sourceId = '';
		this.destinationId = '';
	}
}

export const transferStore = new TransferStore();
