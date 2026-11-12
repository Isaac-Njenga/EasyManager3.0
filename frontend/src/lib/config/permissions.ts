export const canWrite = (role: string | undefined): boolean =>
	role === 'SUPER_ADMIN' || role === 'SALESPERSON';
export function isAuditReadPage(path: string): boolean {
	let normalized: string;
	try {
		normalized = decodeURIComponent(path).replace(/\/$/, '') || '/';
	} catch {
		return false;
	}
	return (
		/^\/(dashboard|products|sales|expenses|website|shops|warehouses|transfers|salepersons|reports|logs|customers)(?:\/|$)/.test(
			normalized
		) && !/(?:^|\/)(?:new|edit)(?:\/|$)/.test(normalized)
	);
}
