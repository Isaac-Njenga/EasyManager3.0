import { Response } from "express";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { createLog } from "../Logs/logs.service";
import { ShopService } from "./shop.service";
import { CreateShopDTO, UpdateShopDTO } from "./shop.types";

const getShopIdParam = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new BadRequestError("Shop ID is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createShop = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const shop = await ShopService.createShop(
      req.body as CreateShopDTO,
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "shop",
      refId: shop._id.toString(),
      action: "created",
      title: "Shop created",
      description: `New shop: '${shop.name}' was created`,
      refModel: "shop",
      actor: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: shop,
      message: "Shop created successfully",
    });
  },
);

export const fetchShops = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const shops = await ShopService.fetchShops({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: req.query.search as string,
      status: req.query.status as string,
      type: req.query.type as string,
    });

    res.status(200).json({
      success: true,
      data: shops,
      message: "Shops fetched successfully",
    });
  },
);

export const fetchShopById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getShopIdParam(req.params.id);

    const shop = await ShopService.fetchShopById(
      id,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "shop",
      refId: id,
      action: "received",
      title: "Shop profile retrieved",
      description: `Fetched profile for shop ${id}`,
      refModel: "shop", // Fixed: was previously "patient"
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: shop,
      message: "Shop retrieved successfully",
    });
  },
);

export const updateShop = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getShopIdParam(req.params.id);

    const shop = await ShopService.updateShop(
      id,
      req.body as UpdateShopDTO,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "shop",
      refId: id,
      action: "updated",
      title: "Shop updated",
      description: `Updated profile for shop ${id}`,
      refModel: "shop",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: shop,
      message: "Shop updated successfully",
    });
  },
);

export const deleteShop = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getShopIdParam(req.params.id);

    const shop = await ShopService.deleteShop(
      id,
      req.user!._id.toString(),
      req.user?.role,
    );

    // Create Audit Log
    await createLog({
      type: "shop",
      refId: id,
      action: "deleted",
      title: "Shop deleted",
      description: `Deleted shop ${id}`,
      refModel: "shop",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: shop,
      message: "Shop deleted successfully",
    });
  },
);
