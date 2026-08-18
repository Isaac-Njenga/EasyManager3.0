import type { Component } from 'svelte';

export type TableColumn<T> = {
	key: keyof T | string;
	header: string;

	class?: string;

	render?: Component;
};