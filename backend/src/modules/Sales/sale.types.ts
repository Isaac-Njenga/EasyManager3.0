import { Product } from "../Products";
import { Salesperson } from "../Salepersons";
import { Shop } from "../Shops";

export type PaymentMethod = "Cash" | "M-Pesa" | "Credit Card" | "Bank Transfer";
export type PaymentStatus = "Paid" | "Pending" | "Partially Paid";
export type SaleStatus = "Completed" | "Processing" | "Cancelled" | "Returned";

export type SaleItem = {
  product: Product;
  quantity: number;
  soldPrice: number;
  shop: Shop;
  netProfit?: number; // (sellingPrice - costPrice)
  netLoss?: number; // (costPrice - sellingPrice)
  discount: number; // Discount per item (in KES)
  subTotal: number;
};

export type CustomerInfo = {
  name?: string;
  phone?: string;
  email?: string;
};

export type SaleListResponse = {
  sales: Sale[];
  totalSales: number;
  currentPage: number;
  totalPages: number;
};

export type Sale = {
  _id: string;
  receiptNumber: string;
  customer?: CustomerInfo;
  items: SaleItem[];
  subTotal: number;
  discountTotal: number;
  dateOfSale: string;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: SaleStatus;
  saleperson: Salesperson;
  commission: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export interface CreateSaleDTO {
  receiptNumber: string;
  customer?: CustomerInfo;
  items: SaleItem[];
  subTotal: number;
  discountTotal: number;
  dateOfSale: string;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: SaleStatus;
  saleperson: Salesperson;
  commission: number;
  notes?: string;
}

export interface UpdateSaleDTO {
  customer?: CustomerInfo;
  items?: SaleItem[];
  subTotal?: number;
  discountTotal?: number;
  dateOfSale?: string;
  grandTotal?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  status?: SaleStatus;
  saleperson?: Salesperson;
  commission?: number;
  notes?: string;
}
