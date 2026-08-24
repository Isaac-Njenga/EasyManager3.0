import type { LocationType, StockTransferItem } from '$lib/types/transfer.types';
import type { Product } from '$lib/types/product.types';
import { toast } from 'svelte-sonner';

export type LocationOption = { id: string; name: string; type: LocationType };

class TransferStore {
	sourceId = $state('');
	destinationId = $state('');
	items = $state<StockTransferItem[]>([]); // Starts EMPTY

	// Add item or increment quantity if already added
	addProductItem(product: Product) {
		const existingIndex = this.items.findIndex((i) => i.productId === product._id);

		if (existingIndex !== -1) {
			this.items[existingIndex].quantity += 1;
			toast.info(`Updated quantity for ${product.name}`);
		} else {
			this.items = [
				...this.items,
				{
					productId: product._id,
					productName: product.name,
					code: product.code,
					quantity: 1
				}
			];
			toast.success(`Added ${product.name} to transfer list`);
		}
	}

	removeItem(index: number) {
		this.items = this.items.filter((_, i) => i !== index);
	}

	handleTransfer(locations: LocationOption[]) {
		if (!this.sourceId || !this.destinationId) {
			toast.warning('Please select both source and destination locations.');
			return;
		}

		if (this.items.length === 0) {
			toast.warning('Please select at least one item to transfer.');
			return;
		}

		const validItems = this.items.filter((i) => i.productName.trim() && i.quantity > 0);
		if (validItems.length === 0) {
			toast.warning('Please ensure all items have valid quantities.');
			return;
		}

		const sourceLoc = locations.find((l) => l.id === this.sourceId);
		const destLoc = locations.find((l) => l.id === this.destinationId);

		toast.success('Transfer Initiated!', {
			description: `Moving ${validItems.length} item(s) from ${sourceLoc?.name} to ${destLoc?.name}.`
		});

		// Reset state
		this.items = [];
		this.destinationId = '';
	}
}

export const transferStore = new TransferStore();
