<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const result = $derived(data.result);
	const error = $derived(data.error);
	const formatDate = (value: string) => new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
</script>

<svelte:head><title>Logs | EasyManager</title></svelte:head>

<div class="space-y-6">
	<PageHeader title="Audit logs" description="Track activity across the application." />
	{#if error}
		<Card><CardContent class="py-10 text-center"><p class="font-medium">Unable to load logs</p><p class="mt-1 text-sm text-muted-foreground">{error}</p></CardContent></Card>
	{:else if !result || result.logs.length === 0}
		<Card><CardContent class="py-10 text-center text-muted-foreground">No activity has been recorded yet.</CardContent></Card>
	{:else}
		<Card><CardContent class="p-0"><div class="divide-y">{#each result.logs as log (log._id)}<article class="flex gap-4 p-4"><span class="mt-1.5 size-2 shrink-0 rounded-full bg-primary"></span><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"><p class="font-medium">{log.title ?? `${log.action} ${log.refModel}`}</p><time class="text-xs text-muted-foreground">{formatDate(log.createdAt)}</time></div><p class="mt-1 text-sm text-muted-foreground">{log.description ?? 'No additional details were recorded.'}</p><p class="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{log.type} · {log.action}</p></div></article>{/each}</div></CardContent></Card>
		<p class="text-right text-xs text-muted-foreground">Showing {result.logs.length} of {result.totalLogs} log entries.</p>
	{/if}
</div>
