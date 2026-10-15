<script lang="ts" generics="TData extends Product">
	import { type ColumnDef, createTable, FlexRender } from '@tanstack/svelte-table';
	import * as Table from '$lib/components/ui/table/index.js';
	import { features, type DataTableFeatures } from './features';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import ChevronFirst from '@lucide/svelte/icons/chevron-first';
	import ChevronLast from '@lucide/svelte/icons/chevron-last';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { Product } from '$lib/services/product/product.types';
	import { Label } from '$lib/components/ui/label';

	type DataTableProps<TData extends Product> = {
		columns: ColumnDef<DataTableFeatures, TData>[];
		data: TData[];
	};

	let searchQuery = $state('');
	let { data, columns }: DataTableProps<TData> = $props();

	const searchableFields: (keyof Product)[] = [
		'name',
		'code',
		'sku',
		'colour',
		'category',
		'status'
	];

	const filteredData = $derived.by(() => {
		const query = searchQuery.trim().toLowerCase();

		if (!query) return data;

		return data.filter((product) =>
			searchableFields.some((field) => {
				const value = (product as Product)[field];

				return value != null && String(value).toLowerCase().includes(query);
			})
		);
	});

	const table = createTable({
		features,
		get data() {
			return filteredData;
		},
		get columns() {
			return columns;
		},
		getRowId: (row: TData) => row._id
	});

	const pagination = $derived(table.atoms.pagination.get());
</script>

<div>
	<div class="flex flex-col">
		<div class="flex justify-between p-2">
			<div>
				<InputGroup.Root>
					<InputGroup.Input
						placeholder="Search..."
						value={searchQuery}
						oninput={(e) => {
							searchQuery = e.currentTarget.value;
							table.setPageIndex(0);
						}}
						class="max-w-sm"
					/>
					<InputGroup.Addon>
						<SearchIcon />
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>
			<div class="hidden">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="ms-auto">Hide Columns</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-auto">
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
		<div>
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
						<Table.Row>
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
		</div>
	</div>

	<div class="flex flex-col gap-4 p-2 sm:flex-row sm:items-center sm:justify-between">
		<!-- Rows per page -->
		<div class="flex items-center gap-2 text-sm text-muted-foreground">
			<Label for="page-size">Rows per page</Label>

			<select
				id="page-size"
				class="h-9 w-15 rounded-md border bg-background px-3 text-sm text-foreground"
				value={pagination.pageSize}
				onchange={(e) => {
					table.setPageSize(Number(e.currentTarget.value));
				}}
			>
				{#each [5, 10, 15, 20, 25, 50] as size (size)}
					<option value={size}>{size}</option>
				{/each}
			</select>
		</div>

		<!-- Page indicator and navigation -->
		<div class="flex items-center justify-end gap-5">
			<div class="text-sm text-muted-foreground">
				Page {pagination.pageIndex + 1} of {table.getPageCount()}
			</div>

			<div class="flex gap-1">
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.firstPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronFirst />
				</Button>

				<Button
					variant="outline"
					size="sm"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeft />
				</Button>

				<Button
					variant="outline"
					size="sm"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<ChevronRight />
				</Button>

				<Button
					variant="outline"
					size="sm"
					onclick={() => table.lastPage()}
					disabled={!table.getCanNextPage()}
				>
					<ChevronLast />
				</Button>
			</div>
		</div>
	</div>
</div>
