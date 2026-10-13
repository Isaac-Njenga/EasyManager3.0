<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { InventoryTransfer as Transfer } from '$lib/services/transfers/transfer.types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';

	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		transfer
	}: {
		transfer: Transfer;
	} = $props();

	//eslint-disable-next-line
	let selectedTransfer = $state<Transfer | null>(null);

	function viewTransfer(transfer: Transfer) {
		selectedTransfer = transfer;
		goto(resolve(`/transfers/${transfer._id}`));
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<MoreHorizontal />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => viewTransfer(transfer)}>View</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
