import type { Product } from '$lib/services/product/product.types';
import type {
	TransferType,
	TransferLocation,
	LocationType,
	CreateTransferInput
} from '$lib/services/transfers/transfer.types';
import { toast } from 'svelte-sonner';
import { transferService } from '$lib/services/transfers/transfer.service';
import { getBrowserServiceContext } from '$lib/services/api/browser-context';

export type LocationOption = TransferLocation;

export const transferLocations = $state<LocationOption[]>([]);

class TransferStore {
	sourceId = $state('');
	destinationId = $state('');
	items = $state<Product[]>([]);

	setLocations(locations: LocationOption[]) {
		transferLocations.splice(0, transferLocations.length, ...locations);
	}

	start(sourceId: string) {
		this.reset();
		this.sourceId = sourceId;
	}

	/**
	 * Determines transfer type based on source and destination location types
	 */
	determineTransferType(sourceType: LocationType, destType: LocationType): TransferType {
		if (sourceType === 'Warehouse' && destType === 'Warehouse') return 'inter_warehouse';
		if (sourceType === 'Warehouse' && destType === 'Shop') return 'store_replenishment';
		if (sourceType === 'Shop' && destType === 'Warehouse') return 'return_to_hub';
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
	async handleTransfer(): Promise<boolean> {
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

		const sourceLoc = transferLocations.find((location) => location.locationId === this.sourceId);
		const destLoc = transferLocations.find(
			(location) => location.locationId === this.destinationId
		);

		if (!sourceLoc || !destLoc) {
			toast.error('Invalid location selection.');
			return false;
		}

		const type = this.determineTransferType(sourceLoc.locationType, destLoc.locationType);

		const payload: CreateTransferInput = {
			type,
			source: {
				locationId: sourceLoc.locationId,
				locationType: sourceLoc.locationType
			},
			destination: {
				locationId: destLoc.locationId,
				locationType: destLoc.locationType
			},
			items: validItems.map((item) => item._id),
			totalItemsCount: validItems.reduce((total, item) => total + item.totalQuantity, 0),
			dateOfTransfer: new Date().toISOString(),
			notes: ''
		};

		try {
			await transferService.create(getBrowserServiceContext(), payload);
			toast.success('Transfer initiated');
			this.reset();
			return true;
		} catch (error) {
			const description = error instanceof Error ? error.message : 'Failed to initiate transfer.';
			toast.error('Transfer failed', { description });
			return false;
		}
	}

	reset() {
		this.items = [];
		this.sourceId = '';
		this.destinationId = '';
	}
}

export const transferStore = new TransferStore();
