// handles product addition/distribution to warehouses/shops
import type { Product } from '$lib/services/product/product.types';
import { toast } from 'svelte-sonner';

class DistributionStore {
	addProductItem(product: Product) {
		toast.success(`Added ${product.name} to list`);
	}
}
