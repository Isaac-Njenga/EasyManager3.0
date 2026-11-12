import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../../common/errors/BadRequestError";
import { NotFoundError } from "../../../common/errors/NotFoundError";
import { CatalogModel } from "./catalog.model";
import {
  CreateCatalogDTO,
  UpdateCatalogDTO,
  Catalog,
  CatalogListResponse,
  SearchQuery,
} from "./catalog.types";
import { CategoryModel } from "../Category/category.model";
import {
  createCatalogSchema,
  updateCatalogSchema,
  parseCatalogInput,
} from "./catalog.validation";

const catalogCache = new NodeCache({ stdTTL: 300 });

export const invalidateCatalogCache = (): void => {
  catalogCache.flushAll();
};

const assertCatalogId = (id: string): void => {
  if (!mongoose.isObjectIdOrHexString(id))
    throw new BadRequestError("Invalid Catalog ID format");
};
const toCatalog = (catalog: unknown): Catalog => catalog as Catalog;
const assertCategory = async (id: string): Promise<void> => {
  if (!(await CategoryModel.exists({ _id: id })))
    throw new BadRequestError("Category does not exist");
};

async function saveCatalog(
  document: InstanceType<typeof CatalogModel>,
): Promise<void> {
  try {
    await document.save();
  } catch (error) {
    if ((error as { code?: number }).code === 11000)
      throw new BadRequestError("A catalog item with this slug already exists");
    if (error instanceof mongoose.Error.ValidationError)
      throw new BadRequestError(error.message);
    throw error;
  }
}

export class CatalogService {
  static async createCatalog(
    data: CreateCatalogDTO,
    requesterRole: string,
  ): Promise<Catalog> {
    const createData = parseCatalogInput(createCatalogSchema, data);
    await assertCategory(createData.category);
    const catalogDoc = new CatalogModel(createData);

    await saveCatalog(catalogDoc);

    const savedCatalog = await CatalogModel.findById(catalogDoc._id)
      .populate("category")
      .lean();
    invalidateCatalogCache();
    return toCatalog(savedCatalog ?? catalogDoc.toObject());
  }

  static async fetchCatalogs(
    page = 1,
    requestedLimit = 10,
  ): Promise<CatalogListResponse> {
    if (!Number.isSafeInteger(page) || page < 1) {
      throw new BadRequestError("Page must be a positive integer");
    }
    if (!Number.isSafeInteger(requestedLimit) || requestedLimit < 1) {
      throw new BadRequestError("Limit must be a positive integer");
    }

    const limit = Math.min(requestedLimit, 100);
    const skip = (page - 1) * limit;
    if (!Number.isSafeInteger(skip)) {
      throw new BadRequestError("Page is too large");
    }

    const cacheKey = `catalogs_p${page}_l${limit}`;
    const cachedData = catalogCache.get<CatalogListResponse>(cacheKey);
    if (cachedData) return cachedData;

    const [catalogs, totalCatalogs] = await Promise.all([
      CatalogModel.find({ status: "PUBLISHED" })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("category")
        .lean(),
      CatalogModel.countDocuments({ status: "PUBLISHED" }),
    ]);

    const responseData: CatalogListResponse = {
      catalog: catalogs as unknown as Catalog[],
      totalCatalog: totalCatalogs,
      currentPage: page,
      totalPages: Math.ceil(totalCatalogs / limit),
    };

    catalogCache.set(cacheKey, responseData);
    return responseData;
  }

  static async fetchAllCatalogs(): Promise<CatalogListResponse> {
    const cacheKey = "catalogs_all";
    const cachedData = catalogCache.get<CatalogListResponse>(cacheKey);
    if (cachedData) return cachedData;

    const [catalogs, totalCatalogs] = await Promise.all([
      CatalogModel.find({}).sort({ createdAt: -1 }).populate("category").lean(),
      CatalogModel.countDocuments({}),
    ]);

    const responseData: CatalogListResponse = {
      catalog: catalogs as unknown as Catalog[],
      totalCatalog: totalCatalogs,
      currentPage: 1,
      totalPages: totalCatalogs > 0 ? 1 : 0,
    };

    catalogCache.set(cacheKey, responseData);
    return responseData;
  }

  static async fetchCatalogById(catalogId: string): Promise<Catalog> {
    assertCatalogId(catalogId);

    const cacheKey = `catalog_id_${catalogId}`;
    const cachedCatalog = catalogCache.get<Catalog>(cacheKey);
    if (cachedCatalog) return cachedCatalog;

    const catalog = await CatalogModel.findById(catalogId)
      .populate("category")
      .lean();
    if (!catalog) {
      throw new NotFoundError("Catalog not found!");
    }

    const result = toCatalog(catalog);
    catalogCache.set(cacheKey, result);
    return result;
  }

  static async fetchCatalogBySlug(catalogSlug: string): Promise<Catalog> {
    if (typeof catalogSlug !== "string" || !catalogSlug.trim())
      throw new BadRequestError("Slug is required");
    const cacheKey = `catalog_slug_${catalogSlug}`;
    const cachedCatalog = catalogCache.get<Catalog>(cacheKey);
    if (cachedCatalog) return cachedCatalog;

    const catalog = await CatalogModel.findOne({
      slug: catalogSlug.trim().toLowerCase(),
      status: "PUBLISHED",
    })
      .populate("category")
      .lean();
    if (!catalog) {
      throw new NotFoundError("Catalog not found!");
    }

    const result = toCatalog(catalog);
    catalogCache.set(cacheKey, result);
    return result;
  }

  static async searchCatalog(queryParams: SearchQuery): Promise<Catalog[]> {
    const { query, tag, category, minPrice, maxPrice } = queryParams;

    const filter: Record<string, any> = { status: "PUBLISHED" };

    // 1. Full-text search across indexed fields
    if (query) {
      filter.$text = { $search: query };
    }

    // 2. Exact/Case-insensitive secondary filters
    if (tag) {
      filter.tags = {
        $in: [
          new RegExp(`^${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
        ],
      };
    }

    if (category) {
      assertCatalogId(category);
      filter.category = new mongoose.Types.ObjectId(category);
    }

    for (const price of [minPrice, maxPrice]) {
      if (price !== undefined && (!Number.isFinite(price) || price < 0))
        throw new BadRequestError("Price bounds must be nonnegative numbers");
    }
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
      throw new BadRequestError("Minimum price cannot exceed maximum price");
    // 3. Price range filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter["pricing.basePrice"] = {};
      if (minPrice !== undefined) filter["pricing.basePrice"].$gte = minPrice;
      if (maxPrice !== undefined) filter["pricing.basePrice"].$lte = maxPrice;
    }

    const products = await CatalogModel.find(filter)
      .select(query ? { score: { $meta: "textScore" } } : {})
      .sort(query ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .populate("category")
      .lean();

    return toCatalog(products) as unknown as Catalog[];
  }

  static async fetchBestSellingCatalogProducts(): Promise<Catalog[]> {
    const cacheKey = `best_selling_catalog_products`;
    const cachedProducts = catalogCache.get<Catalog[]>(cacheKey);
    if (cachedProducts) return cachedProducts;

    const products = await CatalogModel.find({
      "merchandising.isBestSeller": true,
      status: "PUBLISHED",
    })
      .sort({ "merchandising.sortOrder": 1, createdAt: -1, _id: 1 })
      .limit(8)
      .populate("category")
      .lean();

    const result = toCatalog(products) as unknown as Catalog[];
    catalogCache.set(cacheKey, result);
    return result;
  }

  static async fetchNewArrivalCatalogs(): Promise<Catalog[]> {
    const cacheKey = `new_arrival_catalog_products`;
    const cachedProducts = catalogCache.get<Catalog[]>(cacheKey);
    if (cachedProducts) return cachedProducts;

    const products = await CatalogModel.find({
      "merchandising.isNewArrival": true,
      status: "PUBLISHED",
    })
      .sort({ "merchandising.sortOrder": 1, createdAt: -1, _id: 1 })
      .limit(8)
      .populate("category")
      .lean();

    const result = toCatalog(products) as unknown as Catalog[];
    catalogCache.set(cacheKey, result);
    return result;
  }

  static async fetchFeaturedCatalogs(): Promise<Catalog[]> {
    const key = "featured_catalog_products";
    const cached = catalogCache.get<Catalog[]>(key);
    if (cached) return cached;
    const products = await CatalogModel.find({
      "merchandising.isFeatured": true,
      status: "PUBLISHED",
    })
      .sort({ "merchandising.sortOrder": 1, createdAt: -1, _id: 1 })
      .limit(8)
      .populate("category")
      .lean();
    const result = products as unknown as Catalog[];
    catalogCache.set(key, result);
    return result;
  }

  static async updateProduct(
    productId: string,
    data: UpdateCatalogDTO,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Catalog> {
    assertCatalogId(productId);

    const update = parseCatalogInput(updateCatalogSchema, data);
    if (update.category) await assertCategory(update.category);
    const product = await CatalogModel.findById(productId);
    if (!product) throw new NotFoundError("Product not found!");
    for (const [key, value] of Object.entries(update)) {
      if (["pricing", "merchandising", "seo"].includes(key) && value) {
        for (const [nestedKey, nestedValue] of Object.entries(value))
          product.set(`${key}.${nestedKey}`, nestedValue);
      } else product.set(key, value);
    }
    await saveCatalog(product);
    await product.populate("category");
    invalidateCatalogCache();
    return toCatalog(product.toObject({ flattenMaps: true }));
  }

  static async deleteProduct(
    productId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Catalog> {
    assertCatalogId(productId);

    const product = await CatalogModel.findByIdAndDelete(productId)
      .populate("category")
      .lean();
    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    invalidateCatalogCache();
    return toCatalog(product);
  }
}
