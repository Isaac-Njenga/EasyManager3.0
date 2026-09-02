import { Response } from "express";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { createLog } from "../Logs/logs.service";
import { ProductService } from "./product.service";
import { CreateProductDTO, UpdateProductDTO } from "./product.types";

const getProductIdParam = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new BadRequestError("Product ID is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const product = await ProductService.createProduct(
      req.body as CreateProductDTO,
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "product",
      refId: product._id.toString(),
      action: "created",
      title: "Product created",
      description: `New product: '${product.name}' was created`,
      refModel: "product",
      actor: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  },
);

export const fetchProducts = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const products = await ProductService.fetchProducts({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: req.query.search as string,
      status: req.query.status as string,
      category: req.query.category as string,
    });

    res.status(200).json({
      success: true,
      data: products,
      message: "Products fetched successfully",
    });
  },
);

export const fetchProductById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getProductIdParam(req.params.id);

    const product = await ProductService.fetchProductById(
      id,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "product",
      refId: id,
      action: "received",
      title: "Product profile retrieved",
      description: `Fetched profile for product ${id}`,
      refModel: "product",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: product,
      message: "Product retrieved successfully",
    });
  },
);

export const updateProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getProductIdParam(req.params.id);

    const product = await ProductService.updateProduct(
      id,
      req.body as UpdateProductDTO,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "product",
      refId: id,
      action: "updated",
      title: "Product updated",
      description: `Updated profile for product ${id}`,
      refModel: "product",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  },
);

export const deleteProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getProductIdParam(req.params.id);

    const product = await ProductService.deleteProduct(
      id,
      req.user!._id.toString(),
      req.user?.role,
    );

    // Create Audit Log
    await createLog({
      type: "product",
      refId: id,
      action: "deleted",
      title: "Product deleted",
      description: `Deleted product ${id}`,
      refModel: "product",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: product,
      message: "Product deleted successfully",
    });
  },
);
