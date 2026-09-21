import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { ProductModel } from "./product.model";
import { ShopModel } from "../Shops/shop.model";
import { WarehouseModel } from "../Warehouses/warehouse.model";
import {
  CreateProductDTO,
  UpdateProductDTO,
  Product,
  ProductListResponse,
} from "./product.types";
import { flattenObject } from "../../utils/flattenObject";

const productCache = new NodeCache({ stdTTL: 300 });

export const invalidateProductCache = (): void => {
  productCache.flushAll();
};

const LOCATION_PROFILE_SELECT = "_id name status type address warehouseCode shopCode";

const getLocationId = (value: unknown): string => {
  if (value && typeof value === "object" && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
};

const isPopulatedLocation = (value: unknown): boolean =>
  Boolean(
    value &&
      typeof value === "object" &&
      "name" in value &&
      typeof (value as { name?: unknown }).name === "string",
  );

/**
 * Resolves dynamic Shop/Warehouse references without relying on refPath
 * population. This also works for legacy documents saved before refPath was
 * introduced.
 */
const hydrateLocationRefs = async (product: any): Promise<any> => {
  const distributions = product?.inventoryDistribution;
  if (!Array.isArray(distributions) || distributions.length === 0) {
    return product;
  }

  const warehouseIds = distributions
    .filter(
      (entry) =>
        entry.locationType === "Warehouse" &&
        !isPopulatedLocation(entry.locationId),
    )
    .map((entry) => getLocationId(entry.locationId));
  const shopIds = distributions
    .filter(
      (entry) =>
        entry.locationType === "Shop" && !isPopulatedLocation(entry.locationId),
    )
    .map((entry) => getLocationId(entry.locationId));

  const [warehouses, shops] = await Promise.all([
    warehouseIds.length
      ? WarehouseModel.find({ _id: { $in: warehouseIds } })
          .select(LOCATION_PROFILE_SELECT)
          .lean()
      : [],
    shopIds.length
      ? ShopModel.find({ _id: { $in: shopIds } })
          .select(LOCATION_PROFILE_SELECT)
          .lean()
      : [],
  ]);
  const locations = new Map(
    [...warehouses, ...shops].map((location) => [String(location._id), location]),
  );

  for (const distribution of distributions) {
    if (isPopulatedLocation(distribution.locationId)) continue;
    const location = locations.get(getLocationId(distribution.locationId));
    if (location) distribution.locationId = location;
  }

  return product;
};

// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set<string>([
  "code",
  "sellingPrice",
  "sku",
  "costPrice",
]);
const BLOCKED_UPDATE_FIELDS = new Set<string>([
  "_id",
  "id",
  "createdAt",
  "updatedAt",
  "totalQuantity",
  "inventoryDistribution",
]);

const assertProductId = (productId: string): void => {
  if (!productId) {
    throw new BadRequestError("Product ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError("Invalid Product ID format");
  }
};

const toProduct = (product: unknown): Product => product as Product;

const sanitizeCreateData = (
  data: CreateProductDTO,
  requesterRole?: string,
): Partial<CreateProductDTO> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Create data is required");
  }
  return { ...data };
};

const sanitizeUpdateData = (
  data: UpdateProductDTO,
  requesterRole?: string,
): Record<string, any> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Update data is required");
  }

  const updateData = { ...data } as Record<string, any>;
  const restrictedFields = Object.keys(updateData).filter((field) => {
    if (BLOCKED_UPDATE_FIELDS.has(field)) return true;
    return requesterRole !== "SUPER_ADMIN" && ADMIN_ONLY_FIELDS.has(field);
  });

  if (restrictedFields.length > 0) {
    throw new BadRequestError(
      `You cannot update these fields: ${restrictedFields.join(", ")}`,
    );
  }

  return flattenObject(updateData);
};

export interface FetchWarehousesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

export class ProductService {
  static async createProduct(
    data: CreateProductDTO,
    requesterRole: string,
  ): Promise<Product> {
    const createData = sanitizeCreateData(data, requesterRole);
    const productDoc = new ProductModel(createData);

    await productDoc.save();

    const savedProduct = await ProductModel.findById(productDoc._id).lean();
    invalidateProductCache();
    return toProduct(
      await hydrateLocationRefs(savedProduct ?? productDoc.toObject()),
    );
  }

  static async fetchProducts(
    queryParams: FetchWarehousesQuery,
  ): Promise<ProductListResponse> {
    const page = Math.max(1, queryParams.page || 1);
    const limit = Math.max(1, Math.min(100, queryParams.limit || 10));
    const skip = (page - 1) * limit;

    const { search, status, category } = queryParams;
    const cacheKey = `products_p${page}_l${limit}_s${search || ""}_st${status || ""}_c${category || ""}`;

    const cachedData = productCache.get<ProductListResponse>(cacheKey);
    if (cachedData) {
      return {
        ...cachedData,
        products: (await Promise.all(
          cachedData.products.map(hydrateLocationRefs),
        )) as Product[],
      };
    }

    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { colour: { $regex: search, $options: "i" } },
      ];
    }

    const [products, totalProducts] = await Promise.all([
      ProductModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      ProductModel.countDocuments(filter),
    ]);

    const responseData: ProductListResponse = {
      products: (await Promise.all(products.map(hydrateLocationRefs))) as Product[],
      totalProducts: totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    };

    //cache response
    productCache.set(cacheKey, responseData);
    return responseData;
  }

  static async fetchProductById(
    productId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Product> {
    assertProductId(productId);

    const cacheKey = `product_detail_${productId}`;
    const cachedProduct = productCache.get<Product>(cacheKey);
    if (cachedProduct) {
      return toProduct(await hydrateLocationRefs(cachedProduct));
    }

    const product = await ProductModel.findById(productId).lean();
    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    const result = toProduct(await hydrateLocationRefs(product));
    productCache.set(cacheKey, result);
    return result;
  }

  static async updateProduct(
    productId: string,
    data: UpdateProductDTO,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Product> {
    assertProductId(productId);

    const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: flattenedUpdateData },
      { new: true, runValidators: true },
    ).lean();

    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    invalidateProductCache();
    return toProduct(await hydrateLocationRefs(product));
  }

  static async deleteProduct(
    productId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<Product> {
    assertProductId(productId);

    const product = await ProductModel.findByIdAndDelete(productId).lean();
    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    invalidateProductCache();
    return toProduct(await hydrateLocationRefs(product));
  }
}
