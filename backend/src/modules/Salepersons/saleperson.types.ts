import { Shop } from "../Shops";
import { User } from "../Users/user.types";

export type SalespersonStatus = "Active" | "Inactive" | "Terminated";

export interface SalepersonListResponse {
  salespersons: Salesperson[];
  totalSalespersons: number;
  totalPages: number;
  currentPage: number;
}

export interface Salesperson {
  _id: string;
  user: User;
  firstName: string;
  lastName: string;
  status: SalespersonStatus;
  assignedShop: Shop;
  totalCommission: number;
  sales?: string[];
  hireDate: string;
  performanceSummary?: SalespersonPerformanceSummary;
  createdAt: string;
  updatedAt: string;
}

export interface SalespersonPerformanceSummary {
  totalSales: number;
  totalRevenueGenerated: number;
  totalCommissionEarned: number;
  totalUnitsSold: number;
}

export interface CreateSalespersonDTO {
  firstName: string;
  lastName: string;
  status: SalespersonStatus;
  assignedShop: string;
  hireDate: string;
}

export interface UpdateSalespersonDTO {
  firstName?: string;
  lastName?: string;
  status?: SalespersonStatus;
  assignedShopId?: string;
  hireDate?: string;
}
