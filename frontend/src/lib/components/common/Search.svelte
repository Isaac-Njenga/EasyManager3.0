<script lang="ts">
    import * as InputGroup from '$lib/components/ui/input-group/index.js';
    import SearchIcon from '@lucide/svelte/icons/search';
    import Loader2Icon from '@lucide/svelte/icons/loader-2';

    let {
        value = '',
        isLoading = $bindable(false), // 1. Allow parent to bind to this
        onChange
    }: {
        value?: string;
        isLoading?: boolean;
        onChange?: (value: string) => void;
    } = $props();

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        onChange?.(input.value);
    }
</script>

<InputGroup.Root>
    <InputGroup.Input placeholder="Search..." oninput={handleInput} {value} />
    <InputGroup.Addon>
        {#if isLoading}
            <Loader2Icon class="animate-spin" />
        {:else}
            <SearchIcon />
        {/if}
    </InputGroup.Addon>
</InputGroup.Root>