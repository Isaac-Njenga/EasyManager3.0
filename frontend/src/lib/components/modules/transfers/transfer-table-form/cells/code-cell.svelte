<script lang="ts">
	let { code, sku }: { code: string; sku: string } = $props();
</script>

<div class="w-full">
	<p class="text-xs uppercase">Code: {code ?? ''}</p>
	<p class="text-xs text-muted-foreground uppercase">SKU: {sku ?? ''}</p>
</div>
