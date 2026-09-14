import mongoose from "mongoose";
import NodeCache from "node-cache";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { WebsiteModel } from "./website.model";
import {
  CreateWebProductDTO,
  UpdateWebProductDTO,
  WebProduct,
  WebProductListResponse,
} from "./website.types";
import { flattenObject } from "../../utils/flattenObject";

const productCache = new NodeCache({ stdTTL: 300 });

export const invalidateProductCache = (): void => {
  productCache.flushAll();
};

// Configurable field restrictions
const ADMIN_ONLY_FIELDS = new Set<string>(["description", "price"]);
const BLOCKED_UPDATE_FIELDS = new Set<string>([
  "_id",
  "id",
  "createdAt",
  "updatedAt",
]);

const assertProductId = (productId: string): void => {
  if (!productId) {
    throw new BadRequestError("Product ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError("Invalid Product ID format");
  }
};

const toProduct = (product: unknown): WebProduct => product as WebProduct;

const sanitizeCreateData = (
  data: CreateWebProductDTO,
  requesterRole?: string,
): Partial<CreateWebProductDTO> => {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestError("Create data is required");
  }
  return { ...data };
};

const sanitizeUpdateData = (
  data: UpdateWebProductDTO,
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

export class WebProductService {
  static async createProduct(
    data: CreateWebProductDTO,
    requesterRole: string,
  ): Promise<WebProduct> {
    const createData = sanitizeCreateData(data, requesterRole);
    const productDoc = new WebsiteModel(createData);

    await productDoc.save();

    const savedProduct = await WebsiteModel.findById(productDoc._id).lean();
    invalidateProductCache();
    return toProduct(savedProduct ?? productDoc.toObject());
  }

  static async fetchProducts(): Promise<WebProductListResponse> {
    const page = Math.max(1);
    const limit = Math.max(1, Math.min(100, 10));
    const skip = (page - 1) * limit;

    const cacheKey = `products_p${page}_l${limit}`;

    const cachedData = productCache.get<WebProductListResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const filter: Record<string, any> = {};

    const [products, totalProducts] = await Promise.all([
      WebsiteModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      WebsiteModel.countDocuments(filter),
    ]);

    const responseData: WebProductListResponse = {
      webProducts: products as unknown as WebProduct[],
      totalWebProducts: totalProducts,
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
  ): Promise<WebProduct> {
    assertProductId(productId);

    const cacheKey = `web_product_detail_${productId}`;
    const cachedProduct = productCache.get<WebProduct>(cacheKey);
    if (cachedProduct) return cachedProduct;

    const product = await WebsiteModel.findById(productId).lean();
    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    const result = toProduct(product);
    productCache.set(cacheKey, result);
    return result;
  }

  static async updateProduct(
    productId: string,
    data: UpdateWebProductDTO,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<WebProduct> {
    assertProductId(productId);

    const flattenedUpdateData = sanitizeUpdateData(data, requesterRole);

    const product = await WebsiteModel.findByIdAndUpdate(
      productId,
      { $set: flattenedUpdateData },
      { new: true, runValidators: true },
    ).lean();

    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    invalidateProductCache();
    return toProduct(product);
  }

  static async deleteProduct(
    productId: string,
    requesterId?: string,
    requesterRole?: string,
  ): Promise<WebProduct> {
    assertProductId(productId);

    const product = await WebsiteModel.findByIdAndDelete(productId).lean();
    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    invalidateProductCache();
    return toProduct(product);
  }
}
