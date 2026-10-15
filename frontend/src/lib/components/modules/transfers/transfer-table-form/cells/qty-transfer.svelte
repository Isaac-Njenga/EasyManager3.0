<script lang="ts">
	import { Input } from '$lib/components/ui/input';

	type Props = {
		productId: string;
		sourceQuantity: number;
		quantityToTransfer: number;
		selected: boolean;
		onQuantityChange: (productId: string, quantity: number) => void;
	};

	let { productId, sourceQuantity, quantityToTransfer, selected, onQuantityChange }: Props =
		$props();
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-col gap-1.5">
		<Input
			type="number"
			min="0"
			max={sourceQuantity}
			step="1"
			value={quantityToTransfer}
			disabled={!selected || sourceQuantity <= 0}
			aria-label="Quantity to transfer"
			oninput={(event) => {
				const value = Number(event.currentTarget.value);
				onQuantityChange(productId, Number.isInteger(value) ? value : 0);
			}}
			class="h-auto rounded-sm text-xs"
		/>
	</div>

	<div class="min-w-0 text-xs sm:pb-1">
		<p class="mt-1 text-muted-foreground">
			Source after transfer: {Math.max(0, sourceQuantity - quantityToTransfer)}
		</p>
	</div>
</div>
