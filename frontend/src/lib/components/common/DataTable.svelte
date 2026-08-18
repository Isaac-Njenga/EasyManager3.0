<script lang="ts" generics="T">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';

	import type { Snippet } from 'svelte';

	type Column<T> = {
		key: keyof T;
		header: string;
		class?: string;
	};

	type Props = {
		data: T[];
		columns: Column<T>[];

		getRowKey?: (item: T, index: number) => string;

		emptyMessage?: string;

		cell?: Snippet<[item: T, column: Column<T>]>;
	};

	let {
		data,
		columns,
		getRowKey = (_, index) => String(index),
		emptyMessage = 'No records found.',
		cell
	}: Props = $props();
</script>

<div class="rounded-lg border">
	<Table>
		<TableHeader>
			<TableRow>
				{#each columns as column (String(column.key))}
					<TableHead class={column.class}>
						{column.header}
					</TableHead>
				{/each}
			</TableRow>
		</TableHeader>

		<TableBody>
			{#each data as item, index (getRowKey(item, index))}
				<TableRow>
					{#each columns as column (String(column.key))}
						<TableCell class={column.class}>
							{#if cell}
								{@render cell(item, column)}
							{:else}
								{String(item[column.key] ?? '')}
							{/if}
						</TableCell>
					{/each}
				</TableRow>
			{:else}
				<TableRow>
					<TableCell colspan={columns.length} class="h-24 text-center">
						{emptyMessage}
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
