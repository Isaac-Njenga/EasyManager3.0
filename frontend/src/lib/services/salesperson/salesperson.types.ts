import type { Shop } from '../shop/shop.types';

export type SalespersonStatus = 'Active' | 'Inactive' | 'Terminated';

export interface Salesperson {
	_id: string;
	firstName: string;
	lastName: string;
	status: SalespersonStatus;
	assignedShop: Shop;
	totalCommission: number;
	performanceSummary?: SalespersonPerformanceSummary;
	hireDate: string;
	createdAt: string;
	updatedAt: string;
}

export interface SalespersonPerformanceSummary {
	totalSales: number;
	totalRevenueGenerated: number;
	totalCommissionEarned: number;
}

export type CreateSalespersonInput = {
	firstName: string;
	lastName: string;
	status: SalespersonStatus;
	assignedShop: string;
	hireDate: string;
};

export type SalespersonListResponse = {
	salespersons: Salesperson[];
	totalSalespersons: number;
	currentPage: number;
	totalPages: number;
};
