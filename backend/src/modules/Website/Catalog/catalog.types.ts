export type CatalogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type CatalogCategory = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

export type CatalogPricing = {
  currency: string;
  basePrice: number;
  compareAtPrice: number | null;
};

export type CatalogMerchandising = {
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  sortOrder: number;
};

export type CatalogSEO = {
  metaTitle?: string;
  metaDescription?: string;
};

export type Catalog = {
  _id: string;
  name: string;
  slug: string;
  description: string;

  // Can be an ObjectId string or a populated Category
  category: string | CatalogCategory;

  tags: string[];
  images: string[];
  colours: string[];
  keyFeatures: string[];
  specifications: Record<string, string>;

  pricing: CatalogPricing;
  merchandising: CatalogMerchandising;

  status: CatalogStatus;

  seo: CatalogSEO;

  createdAt: string;
  updatedAt: string;
};

export type CatalogListResponse = {
  catalog: Catalog[];
  totalCatalog: number;
  currentPage: number;
  totalPages: number;
};

export interface CreateCatalogDTO {
  name: string;
  slug: string;
  description?: string;

  // Send the Category document's ObjectId
  category: string;

  tags?: string[];
  images?: string[];
  colours?: string[];
  keyFeatures?: string[];
  specifications?: Record<string, string>;

  pricing: Pick<CatalogPricing, "basePrice"> &
    Partial<Omit<CatalogPricing, "basePrice">>;
  merchandising?: Partial<CatalogMerchandising>;

  status?: CatalogStatus;
  seo?: CatalogSEO;
}

export type UpdateCatalogDTO = Omit<Partial<CreateCatalogDTO>, "pricing"> & {
  pricing?: Partial<CatalogPricing>;
};

export interface SearchQuery {
  query?: string;
  tag?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
