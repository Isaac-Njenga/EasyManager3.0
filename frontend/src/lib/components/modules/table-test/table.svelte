<script lang="ts" generics="TData extends RowData">
	import {
		type ColumnDef,
		type RowData,
		type RowSelectionState,
		createTable,
		FlexRender,
		createTableState
	} from '@tanstack/svelte-table';
	import * as Table from '$lib/components/ui/table/index.js';
	import { features, type DataTableFeatures } from './features.ts';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	type DataTableProps<TData extends RowData> = {
		columns: ColumnDef<DataTableFeatures, TData>[];
		data: TData[];
	};

	// let pageSize = $state(10);
	let { data, columns }: DataTableProps<TData> = $props();
	const [rowSelection, setRowSelection] = createTableState<RowSelectionState>({});

	//

	const table = createTable({
		features,
		get data() {
			return data;
		},
		get columns() {
			return columns;
		},
		state: {
			get rowSelection() {
				return rowSelection();
			}
		},
		onRowSelectionChange: setRowSelection
	});
	const pagination = $derived(table.atoms.pagination.get());
</script>

<div class="rounded-md border">
	<div class="flex flex-row gap-4">
		<div class="justify between flex items-center p-4">
			<Input
				placeholder="Filter emails..."
				value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
				onchange={(e) => table.getColumn('email')?.setFilterValue(e.currentTarget.value)}
				oninput={(e) => table.getColumn('email')?.setFilterValue(e.currentTarget.value)}
				class="max-w-sm"
			/>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="ms-auto">Columns</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
						>
							{column.id}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head colspan={header.colSpan}>
							{#if !header.isPlaceholder}
								<FlexRender {header} />
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender {cell} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<div>
		<div class="flex items-center justify-end space-x-2 py-4">
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Next
			</Button>
		</div>
		<div class="flex-1 text-sm text-muted-foreground">
			{table.getFilteredSelectedRowModel().rows.length} of
			{table.getFilteredRowModel().rows.length} row(s) selected.
		</div>
	</div>

	<Button variant="outline" size="sm" onclick={() => table.setPageSize(20)}>Show 20 rows</Button>

	<div class="text-sm text-muted-foreground">
		Page {pagination.pageIndex + 1} of {table.getPageCount()}
	</div>
</div>
