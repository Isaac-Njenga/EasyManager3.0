export type TableColumn<T> = {
	key: keyof T | string;
	header: string;
	class?: string;

	/**
	 * Use for simple value transformations.
	 */
	render?: (value: unknown, record: T) => string | number;

	/**
	 * Name of a Svelte snippet supplied to DataTable.
	 */
	cell?: string;
};