<script lang="ts" generics="T">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';

	import { Button } from '$lib/components/ui/button';

	import type { Snippet } from 'svelte';
	import type { TableColumn } from '$lib/types/table.types';

	type CellSnippet = Snippet<[value: unknown, record: T]>;

	type Props = {
		data: T[];
		columns: TableColumn<T>[];

		getRowKey?: (record: T, index: number) => string;

		emptyMessage?: string;

		cells?: Record<string, CellSnippet>;

		// Pagination
		pagination?: boolean;
		pageSize?: number;
		pageSizeOptions?: number[];
	};

	let {
		data,
		columns,
		getRowKey = (_, index) => String(index),
		emptyMessage = 'No records found.',
		cells = {},

		pagination = false,
		pageSize = 10,
		pageSizeOptions = [10, 20, 50, 100]
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

	// ----------------------------------------
	// Pagination
	// ----------------------------------------

	let currentPage = $state(1);

	let selectedPageSize = $state(pageSize);

	const totalItems = $derived(data.length);

	const totalPages = $derived(Math.max(1, Math.ceil(totalItems / selectedPageSize)));

	const paginatedData = $derived(
		pagination
			? data.slice((currentPage - 1) * selectedPageSize, currentPage * selectedPageSize)
			: data
	);

	const startItem = $derived(totalItems === 0 ? 0 : (currentPage - 1) * selectedPageSize + 1);

	const endItem = $derived(Math.min(currentPage * selectedPageSize, totalItems));

	function goToPage(page: number) {
		currentPage = Math.min(Math.max(page, 1), totalPages);
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function previousPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function changePageSize(size: number) {
		selectedPageSize = size;
		currentPage = 1;
	}

	// Make sure the current page stays valid if data changes.
	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});
	type PaginationItem = number | 'ellipsis';

	const pageNumbers = $derived.by<PaginationItem[]>(() => {
		const pages: PaginationItem[] = [];

		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, index) => index + 1);
		}

		// Always show first page
		pages.push(1);

		// Near the beginning
		if (currentPage <= 4) {
			pages.push(2, 3, 4, 5);
			pages.push('ellipsis');
			pages.push(totalPages);

			return pages;
		}

		// Near the end
		if (currentPage >= totalPages - 3) {
			pages.push('ellipsis');
			pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);

			return pages;
		}

		// Middle
		pages.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);

		return pages;
	});
</script>

<div class="overflow-hidden rounded-lg border">
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
			{#each paginatedData as record, index (getRowKey(record, index))}
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

	{#if pagination && totalItems > 0}
		<div
			class="flex flex-col gap-4 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
		>
			<!-- Results information -->
			<div class="text-sm text-muted-foreground">
				Showing
				<span class="font-medium text-foreground">{startItem}</span>
				to
				<span class="font-medium text-foreground">{endItem}</span>
				of
				<span class="font-medium text-foreground">{totalItems}</span>
				results
			</div>

			<div class="flex items-center gap-4">
				<!-- Page size -->
				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground"> Rows per page </span>

					<select
						class="h-9 rounded-md border bg-background px-2 text-sm"
						value={selectedPageSize}
						onchange={(event) =>
							changePageSize(Number((event.currentTarget as HTMLSelectElement).value))}
					>
						{#each pageSizeOptions as size (size)}
							<option value={size}>
								{size}
							</option>
						{/each}
					</select>
				</div>

				<!-- Navigation -->
				<div class="flex items-center gap-1">
					<Button variant="outline" size="sm" disabled={currentPage === 1} onclick={previousPage}>
						Previous
					</Button>

					{#each pageNumbers as page, index (`${page}-${index}`)}
						{#if page === 'ellipsis'}
							<span class="flex size-9 items-center justify-center text-sm text-muted-foreground">
								...
							</span>
						{:else}
							<Button
								variant={currentPage === page ? 'default' : 'outline'}
								size="sm"
								class="min-w-9"
								onclick={() => goToPage(page)}
							>
								{page}
							</Button>
						{/if}
					{/each}

					<Button
						variant="outline"
						size="sm"
						disabled={currentPage === totalPages}
						onclick={nextPage}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
