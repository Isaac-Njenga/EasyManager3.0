<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	let { status }: { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' } = $props();
</script>

<Badge variant="outline">{status}</Badge>
