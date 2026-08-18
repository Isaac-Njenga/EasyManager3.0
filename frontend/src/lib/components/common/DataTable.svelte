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
	import type { TableColumn } from '$lib/types/table.types';

	type CellSnippet = Snippet<[value: unknown, record: T]>;

	type Props = {
		data: T[];
		columns: TableColumn<T>[];
		getRowKey?: (record: T, index: number) => string;
		emptyMessage?: string;
		cells?: Record<string, CellSnippet>;
	};

	let {
		data,
		columns,
		getRowKey = (_, index) => String(index),
		emptyMessage = 'No records found.',
		cells = {}
	}: Props = $props();

	function getNestedValue(record: unknown, path: string): unknown {
		return path.split('.').reduce<unknown>((current, key) => {
			if (current == null || typeof current !== 'object') {
				return undefined;
			}

			return (current as Record<string, unknown>)[key];
		}, record);
	}

	function getValue(record: T, column: TableColumn<T>) {
		const key = String(column.key);

		if (key.includes('.')) {
			return getNestedValue(record, key);
		}

		if (Object.prototype.hasOwnProperty.call(record as object, key)) {
			return (record as Record<string, unknown>)[key];
		}

		return undefined;
	}
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
			{#each data as record, index (getRowKey(record, index))}
				<TableRow>
					{#each columns as column (String(column.key))}
						{@const value = getValue(record, column)}
						{@const cell = column.cell ? cells[column.cell] : undefined}
						{@const renderedValue = column.render ? column.render(value, record) : value}

						<TableCell class={column.class}>
							{#if cell}
								{@render cell(value, record)}
							{:else if column.render}
								{renderedValue ?? ''}
							{:else}
								{String(value ?? '')}
							{/if}
						</TableCell>
					{/each}
				</TableRow>
			{:else}
				<TableRow>
					<TableCell colspan={columns.length} class="h-24 text-center text-muted-foreground">
						{emptyMessage}
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
