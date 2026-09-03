export type ExpenseCategory =
  | "Rent & Utilities"
  | "Salaries & Wages"
  | "Inventory & Supplies"
  | "Marketing & Ads"
  | "Transport & Logistics"
  | "Maintenance & Repairs"
  | "Licenses & Taxes"
  | "Miscellaneous";

export type PaymentMethod = "M-Pesa" | "Cash" | "Bank Transfer" | "Credit Card";
export type ExpenseStatus = "Paid" | "Pending" | "Cancelled";

export type ExpenseListResponse = {
  expenses: Expense[];
  totalExpenses: number;
  currentPage: number;
  totalPages: number;
};

export type Expense = {
  _id: string;
  expenseNumber: string; // e.g., EXP-2026-1001
  title: string;
  category: ExpenseCategory;
  amount: number;
  dateOfExpense: string;
  paymentMethod: PaymentMethod;
  paymentStatus: ExpenseStatus;
  payee: string; // Vendor, employee, or organization paid
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export interface CreateExpenseDTO {
  expenseNumber: string; // e.g., EXP-2026-1001
  title: string;
  category: ExpenseCategory;
  amount: number;
  dateOfExpense: string;
  paymentMethod: PaymentMethod;
  paymentStatus: ExpenseStatus;
  payee?: string; // Vendor, employee, or organization paid
  notes?: string;
}

export interface UpdateExpenseDTO {
  expenseNumber?: string; // e.g., EXP-2026-1001
  title?: string;
  category?: ExpenseCategory;
  amount?: number;
  dateOfExpense?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: ExpenseStatus;
  payee?: string; // Vendor, employee, or organization paid
  notes?: string;
}
