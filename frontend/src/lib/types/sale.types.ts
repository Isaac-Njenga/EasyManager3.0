import type { Salesperson } from './saleperson.types';
import type { Shop } from './shop.types';

export type PaymentMethod = 'Cash' | 'M-Pesa' | 'Credit Card' | 'Bank Transfer';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partially Paid';
export type SaleStatus = 'Completed' | 'Processing' | 'Cancelled' | 'Returned';

export type SaleItem = {
	productId: string; // Refers to Product._id
	productName: string;
	image?: string[];
	category: string;
	colour: string;
	description?: string;
	code?: string; // Cached for snapshot/historical integrity
	sku: string;
	sellingPrice: number; // Price at time of sale
	costPrice: number; // Cost price at time of sale (for profit metrics)
	quantity: number;
	shop: Shop;
	netProfit?: number; // (sellingPrice - costPrice)
	netLoss?: number; // (costPrice - sellingPrice)
	discount: number; // Discount per item (in KES)
	totalPrice: number; // (unitPrice * quantity) - discount
};

export type CustomerInfo = {
	name?: string;
	phone?: string;
	email?: string;
};

export type Sale = {
	_id: string;
	receiptNumber: string; // e.g., "REC-2026-001"
	customer?: CustomerInfo;
	items: SaleItem[];
	subTotal: number;
	// taxAmount: number;        // VAT or local tax calculation
	discountTotal: number;
	dateOfSale: string;
	grandTotal: number; // subTotal + taxAmount - discountTotal
	paymentMethod: PaymentMethod;
	paymentStatus: PaymentStatus;
	status: SaleStatus;
	// mpesaReference?: string;  // Payment transaction codes
	saleperson: string | Salesperson;
	commission: number;
	notes?: string;
	createdAt: string; // ISO Date String
	updatedAt: string; // ISO Date String
};
