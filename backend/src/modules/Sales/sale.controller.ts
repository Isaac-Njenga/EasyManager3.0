import { Response } from "express";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { createLog } from "../Logs/logs.service";
import { SaleService } from "./sale.service";
import { CreateSaleDTO, UpdateSaleDTO } from "./sale.types";

const getSaleIdParam = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new BadRequestError("Sale ID is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createSale = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const sale = await SaleService.createSale(
      req.body as CreateSaleDTO,
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "sale",
      refId: sale._id.toString(),
      action: "created",
      title: "Sale created",
      description: `New sale: '${sale._id}' was created`,
      refModel: "sale",
      actor: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: sale,
      message: "Sale created successfully",
    });
  },
);

export const fetchSales = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const sales = await SaleService.fetchSales({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    });

    res.status(200).json({
      success: true,
      data: sales,
      message: "Sales fetched successfully",
    });
  },
);

export const fetchSaleById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getSaleIdParam(req.params.id);

    const sale = await SaleService.fetchSaleById(
      id,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "sale",
      refId: id,
      action: "received",
      title: "Sale profile retrieved",
      description: `Fetched profile for sale ${id}`,
      refModel: "sale",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: sale,
      message: "Sale retrieved successfully",
    });
  },
);

export const updateSale = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getSaleIdParam(req.params.id);

    const sale = await SaleService.updateSale(
      id,
      req.body as UpdateSaleDTO,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "sale",
      refId: id,
      action: "updated",
      title: "Sale updated",
      description: `Updated profile for sale ${id}`,
      refModel: "sale",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: sale,
      message: "Sale updated successfully",
    });
  },
);

export const deleteSale = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getSaleIdParam(req.params.id);

    const sale = await SaleService.deleteSale(
      id,
      req.user!._id.toString(),
      req.user?.role,
    );

    // Create Audit Log
    await createLog({
      type: "sale",
      refId: id,
      action: "deleted",
      title: "Sale deleted",
      description: `Deleted sale ${id}`,
      refModel: "sale",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: sale,
      message: "Sale deleted successfully",
    });
  },
);
