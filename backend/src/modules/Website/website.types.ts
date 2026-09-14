export type WebProductListResponse = {
  webProducts: WebProduct[];
  totalWebProducts: number;
  currentPage: number;
  totalPages: number;
};

export type WebProduct = {
  _id: string;
  image: string[];
  name: string;
  price: number;
  discount: number;
  category: string;
  description: string;
  colours: string[];
  inStock: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
};

export interface CreateWebProductDTO {
  image: string[];
  name: string;
  price: number;
  discount?: number;
  category: string;
  description: string;
  colours: string[];
  inStock?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface UpdateWebProductDTO {
  image?: string[];
  name?: string;
  price?: number;
  discount?: number;
  category?: string;
  description?: string;
  colours?: string[];
  inStock?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}
