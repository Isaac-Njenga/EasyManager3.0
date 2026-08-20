<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';

	type Props = {
		open?: boolean;
		handleDelete: () => void;
	};

	let { open = $bindable(false), handleDelete }: Props = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Are you sure?</Dialog.Title>
			<Dialog.Description>You cannot undo this action</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
				Cancel
			</Dialog.Close>
			<Button onclick={handleDelete}>Proceed</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
