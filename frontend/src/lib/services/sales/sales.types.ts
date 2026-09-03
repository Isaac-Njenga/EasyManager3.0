import type { Product } from '../product/product.types';
import type { Salesperson } from '../salesperson/salesperson.types';
import type { Shop } from '../shop/shop.types';

export type PaymentMethod = 'Cash' | 'M-Pesa' | 'Credit Card' | 'Bank Transfer';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partially Paid';
export type SaleStatus = 'Completed' | 'Processing' | 'Cancelled' | 'Returned';

export type OmittedProduct = Omit<Product, 'inventory'>;

export type SaleItem = {
	product: OmittedProduct;
	quantity: number;
	shop: Shop;
	soldPrice?: number;
	netProfit?: number; // (sellingPrice - costPrice)
	netLoss?: number; // (costPrice - sellingPrice)
	discount: number; // Discount per item (in KES)
	totalPrice: number; // (unitPrice * quantity) - discount
};

export type CreateSaleItem = {
	product: string;
	quantity: number;
	shop: string;
	soldPrice: number;
	netProfit?: number;
	netLoss?: number;
	discount: number;
	subTotal: number;
};

export type CustomerInfo = {
	name?: string;
	phone?: string;
	email?: string;
};

export type Sale = {
	_id: string;
	receiptNumber: string;
	customer?: CustomerInfo;
	items: SaleItem[];
	subTotal: number;
	discountTotal: number;
	dateOfSale: string;
	grandTotal: number; // subTotal + taxAmount - discountTotal
	paymentMethod: PaymentMethod;
	paymentStatus: PaymentStatus;
	status: SaleStatus;
	saleperson: Salesperson;
	commission: number;
	notes?: string;
	createdAt: string; // ISO Date String
	updatedAt: string; // ISO Date String
};

export type CreateSaleInput = {
	customer?: CustomerInfo;
	items: CreateSaleItem[];
	subTotal: number;
	discountTotal: number;
	dateOfSale: string;
	grandTotal: number; // subTotal + taxAmount - discountTotal
	paymentMethod: PaymentMethod;
	paymentStatus: PaymentStatus;
	status: SaleStatus;
	saleperson: string;
	commission: number;
	notes?: string;
};

export type SaleListResponse = {
	sales: Sale[];
	totalSales: number;
	currentPage: number;
	totalPages: number;
};
