export type ProductStatus = "Active" | "Inactive";

export type ProductListResponse = {
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
};

export interface Product {
  _id: string;
  name: string;
  sku: string;
  code: string;
  colour: string;
  image: string[];
  description?: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  totalQuantity: number;
  status: ProductStatus;
  // inventory?: LocationStock[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  sku?: string;
  code: string;
  colour?: string;
  image?: string[];
  description?: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  status: ProductStatus;
}

export interface UpdateProductDTO {
  name?: string;
  sku?: string;
  code?: string;
  colour?: string;
  image?: string[];
  description?: string;
  category?: string;
  costPrice?: number;
  sellingPrice?: number;
  status?: ProductStatus;
}
