import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { ProductModel } from "./product.model";
import { WarehouseModel } from "../Warehouses/warehouse.model";
import { hydrateProductLocationRefs as hydrateLocationRefs } from "./product-location-hydration";
import {
  CreateProductDTO,
  UpdateProductDTO,
  Product,
  ProductListResponse,
} from "./product.types";
import { flattenObject } from "../../utils/flattenObject";
import { invalidateWarehouseCache } from "../Warehouses/warehouse.service";

const productCache = new NodeCache({ stdTTL: 300 });

export const invalidateProductCache = (): void => {
  productCache.flushAll();
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
    const warehouses = await WarehouseModel.find({}).select("_id");
    const productDoc = new ProductModel({
      ...createData,
      totalQuantity: 0,
      inventoryDistribution: warehouses.map((warehouse) => ({
        locationType: "Warehouse",
        locationId: warehouse._id,
        quantity: 0,
      })),
    });

    await productDoc.save();

    try {
      await WarehouseModel.updateMany(
        { "inventoryItems.product": { $ne: productDoc._id } },
        {
          $addToSet: {
            inventoryItems: { product: productDoc._id, quantity: 0 },
          },
          $inc: {
            "inventorySummary.totalProducts": 1,
            "inventorySummary.outOfStockItemsCount": 1,
          },
        },
      );
    } catch (error) {
      await WarehouseModel.updateMany(
        { "inventoryItems.product": productDoc._id },
        {
          $pull: { inventoryItems: { product: productDoc._id } },
          $inc: {
            "inventorySummary.totalProducts": -1,
            "inventorySummary.outOfStockItemsCount": -1,
          },
        },
      );
      await ProductModel.findByIdAndDelete(productDoc._id);
      throw error;
    }

    const savedProduct = await ProductModel.findById(productDoc._id).lean();
    invalidateProductCache();
    invalidateWarehouseCache();
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
        products: await hydrateLocationRefs(cachedData.products),
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
      products: await hydrateLocationRefs(products),
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
