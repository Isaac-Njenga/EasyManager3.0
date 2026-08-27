import type { Shop } from './shop.types';

export type SalespersonStatus = 'Active' | 'Inactive' | 'Terminated';

export interface Salesperson {
	_id: string;
	firstName: string;
	lastName: string;
	status: SalespersonStatus;
	assignedShop: Shop;
	totalCommission: number;
	hireDate: string;
	createdAt: string;
	updatedAt: string;
}

export interface SalespersonPerformanceSummary {
	salespersonId: string;
	salespersonName: string;
	totalSales: number;
	totalRevenueGenerated: number;
	totalCommissionEarned: number;
}
