export type PaymentMethod = 'Cash' | 'M-Pesa' | 'Credit Card' | 'Bank Transfer';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partially Paid' | 'Refunded';
export type SaleStatus = 'Completed' | 'Processing' | 'Cancelled' | 'Returned';

export type SaleItem = {
    productId: string;        // Refers to Product._id
    productName: string;      // Cached for snapshot/historical integrity
    sku: string;
    unitPrice: number;        // Price at time of sale
    costPrice: number;        // Cost price at time of sale (for profit metrics)
    quantity: number;
    discount: number;         // Discount per item (in KES)
    totalPrice: number;       // (unitPrice * quantity) - discount
};

export type CustomerInfo = {
    name?: string;
    phone?: string;
    email?: string;
};

export type Sale = {
    _id: string;
    receiptNumber: string;    // e.g., "REC-2026-001"
    customer?: CustomerInfo;
    items: SaleItem[];
    subTotal: number;
    // taxAmount: number;        // VAT or local tax calculation
    discountTotal: number;
    grandTotal: number;       // subTotal + taxAmount - discountTotal
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    status: SaleStatus;
    // mpesaReference?: string;  // Payment transaction codes
    saleperson: string;
    notes?: string;
    createdAt: string;        // ISO Date String
    updatedAt: string;        // ISO Date String
};