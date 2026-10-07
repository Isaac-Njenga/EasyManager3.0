import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function searchableValues(value: unknown, seen = new WeakSet<object>()): string[] {
	if (value === null || value === undefined) return [];
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return [String(value)];
	}
	if (typeof value === 'bigint') return [value.toString()];
	if (value instanceof Date) return [value.toISOString()];
	if (Array.isArray(value)) {
		return value.flatMap((entry) => searchableValues(entry, seen));
	}
	if (typeof value === 'object') {
		if (seen.has(value)) return [];
		seen.add(value);
		return Object.values(value).flatMap((entry) => searchableValues(entry, seen));
	}
	return [];
}

export function matchesSearchQuery(value: unknown, query: string): boolean {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return true;
	return searchableValues(value).some((entry) => entry.toLowerCase().includes(normalizedQuery));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export const formatCurrency = (value: number) =>
	new Intl.NumberFormat('en-KE', {
		style: 'currency',
		currency: 'KES',
		minimumFractionDigits: 0
	}).format(Number(value ?? 0));
