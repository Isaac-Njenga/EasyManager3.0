import { Response, NextFunction, Request } from "express";
import { BadRequestError } from "../../../common/errors/BadRequestError";
import { catchAsync } from "../../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { createLog } from "../../Logs/logs.service";
import { CatalogService } from "./catalog.service";
import {
  CreateCatalogDTO,
  UpdateCatalogDTO,
  SearchQuery,
} from "./catalog.types";
import { broadcastEvent } from "../../../ws/socket";

const getCatalogIdParam = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new BadRequestError("Catalog ID is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createCatalog = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const catalog = await CatalogService.createCatalog(
      req.body as CreateCatalogDTO,
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "catalog",
      refId: catalog._id.toString(),
      action: "created",
      title: "Catalog created",
      description: `New catalog: '${catalog.name}' was created`,
      refModel: "Catalog",
      actor: req.user?._id,
    });

    broadcastEvent("dashboard:refresh", {
      resource: "website",
      action: "created",
    });
    res.status(201).json({
      success: true,
      data: catalog,
      message: "Catalog created successfully",
    });
  },
);

export const fetchCatalogs = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const parsePaginationParam = (
      value: unknown,
      defaultValue: number,
      parameterName: string,
    ): number => {
      if (value === undefined) return defaultValue;
      if (typeof value !== "string" || !/^\d+$/.test(value)) {
        throw new BadRequestError(
          `${parameterName} must be a positive integer`,
        );
      }

      const parsedValue = Number(value);
      if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
        throw new BadRequestError(
          `${parameterName} must be a positive integer`,
        );
      }
      return parsedValue;
    };

    const catalogs = await CatalogService.fetchCatalogs(
      parsePaginationParam(req.query.page, 1, "Page"),
      parsePaginationParam(req.query.limit, 10, "Limit"),
    );

    res.status(200).json({
      success: true,
      data: catalogs,
      message: "Catalogs fetched successfully",
    });
  },
);

export const fetchAllCatalogs: ReturnType<typeof catchAsync> = catchAsync(
  async (_req: AuthenticatedRequest, res: Response) => {
    const products = await CatalogService.fetchAllCatalogs();

    res.status(200).json({
      success: true,
      data: products,
      message: "Catalog products fetched successfully",
    });
  },
);

export const fetchCatalogById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getCatalogIdParam(req.params.id);

    const catalog = await CatalogService.fetchCatalogById(id);

    res.status(200).json({
      success: true,
      data: catalog,
      message: "Catalog retrieved successfully",
    });
  },
);

export const fetchCatalogBySlug = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    const product = await CatalogService.fetchCatalogBySlug(slug);

    res.status(200).json({
      success: true,
      data: product,
      message: "Catalog retrieved successfully",
    });
  },
);

export const searchProduct = async (
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query, tag, category, minPrice, maxPrice } = req.query;
    for (const value of [query, tag, category, minPrice, maxPrice]) {
      if (value !== undefined && (typeof value !== "string" || !value.trim()))
        throw new BadRequestError("Search parameters must be nonempty strings");
    }

    const results = await CatalogService.searchCatalog({
      minPrice: minPrice === undefined ? undefined : Number(minPrice),
      maxPrice: maxPrice === undefined ? undefined : Number(maxPrice),
      query: query ? String(query) : undefined,
      tag: tag ? String(tag) : undefined,
      category: category ? String(category) : undefined,
    });

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchBestSellingCatalogProducts = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const products = await CatalogService.fetchBestSellingCatalogProducts();

    res.status(200).json({
      success: true,
      data: products,
      message: "Catalog products fetched successfully",
    });
  },
);

export const fetchNewArrivalCatalogs = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const products = await CatalogService.fetchNewArrivalCatalogs();

    res.status(200).json({
      success: true,
      data: products,
      message: "Catalog products fetched successfully",
    });
  },
);

export const updateProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getCatalogIdParam(req.params.id);

    const product = await CatalogService.updateProduct(
      id,
      req.body as UpdateCatalogDTO,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "catalog",
      refId: id,
      action: "updated",
      title: "Catalog updated",
      description: `Updated profile for catalog ${id}`,
      refModel: "Catalog",
      actor: req.user?._id,
    });

    broadcastEvent("dashboard:refresh", {
      resource: "website",
      action: "updated",
    });
    res.status(200).json({
      success: true,
      data: product,
      message: "Catalog updated successfully",
    });
  },
);

export const deleteProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getCatalogIdParam(req.params.id);

    const product = await CatalogService.deleteProduct(
      id,
      req.user!._id.toString(),
      req.user?.role,
    );

    // Create Audit Log
    await createLog({
      type: "catalog",
      refId: id,
      action: "deleted",
      title: "Catalog deleted",
      description: `Deleted catalog ${id}`,
      refModel: "Catalog",
      actor: req.user?._id,
    });

    broadcastEvent("dashboard:refresh", {
      resource: "website",
      action: "deleted",
    });
    res.status(200).json({
      success: true,
      data: product,
      message: "Catalog deleted successfully",
    });
  },
);

export const fetchFeaturedCatalogs = catchAsync(
  async (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: await CatalogService.fetchFeaturedCatalogs(),
    });
  },
);
