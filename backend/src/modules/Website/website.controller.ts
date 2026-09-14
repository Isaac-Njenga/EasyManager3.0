import { Response } from "express";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { createLog } from "../Logs/logs.service";
import { WebProductService } from "./website.service";
import {
  CreateWebProductDTO as CreateProductDTO,
  UpdateWebProductDTO as UpdateProductDTO,
} from "./website.types";

const getProductIdParam = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new BadRequestError("WebProduct ID is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const product = await WebProductService.createProduct(
      req.body as CreateProductDTO,
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "webproduct",
      refId: product._id.toString(),
      action: "created",
      title: "WebProduct created",
      description: `New webproduct: '${product.name}' was created`,
      refModel: "webproduct",
      actor: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: product,
      message: "WebProduct created successfully",
    });
  },
);

export const fetchProducts = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const products = await WebProductService.fetchProducts();

    res.status(200).json({
      success: true,
      data: products,
      message: "WebProducts fetched successfully",
    });
  },
);

export const fetchProductById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getProductIdParam(req.params.id);

    const product = await WebProductService.fetchProductById(
      id,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "webproduct",
      refId: id,
      action: "received",
      title: "WebProduct profile retrieved",
      description: `Fetched profile for webproduct ${id}`,
      refModel: "webproduct",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: product,
      message: "WebProduct retrieved successfully",
    });
  },
);

export const updateProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getProductIdParam(req.params.id);

    const product = await WebProductService.updateProduct(
      id,
      req.body as UpdateProductDTO,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "webproduct",
      refId: id,
      action: "updated",
      title: "WebProduct updated",
      description: `Updated profile for webproduct ${id}`,
      refModel: "webproduct",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: product,
      message: "WebProduct updated successfully",
    });
  },
);

export const deleteProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getProductIdParam(req.params.id);

    const product = await WebProductService.deleteProduct(
      id,
      req.user!._id.toString(),
      req.user?.role,
    );

    // Create Audit Log
    await createLog({
      type: "webproduct",
      refId: id,
      action: "deleted",
      title: "WebProduct deleted",
      description: `Deleted webproduct ${id}`,
      refModel: "webproduct",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: product,
      message: "WebProduct deleted successfully",
    });
  },
);
