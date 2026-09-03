import { Response } from "express";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { createLog } from "../Logs/logs.service";
import { SalespersonService } from "./saleperson.service";
import { CreateSalespersonDTO, UpdateSalespersonDTO } from "./saleperson.types";

const getSalespersonIdParam = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new BadRequestError("Salesperson ID is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createSalesperson = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const salesperson = await SalespersonService.createSalesperson(
      req.body as CreateSalespersonDTO,
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "salesperson",
      refId: salesperson._id.toString(),
      action: "created",
      title: "Salesperson created",
      description: `New salesperson: '${salesperson._id}' was created`,
      refModel: "salesperson",
      actor: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: salesperson,
      message: "Salesperson created successfully",
    });
  },
);

export const fetchSalespersons = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const salespersons = await SalespersonService.fetchSalespersons({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    });

    res.status(200).json({
      success: true,
      data: salespersons,
      message: "Salespersons fetched successfully",
    });
  },
);

export const fetchSalespersonById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getSalespersonIdParam(req.params.id);

    const salesperson = await SalespersonService.fetchSalespersonById(
      id,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "salesperson",
      refId: id,
      action: "received",
      title: "Salesperson profile retrieved",
      description: `Fetched profile for salesperson ${id}`,
      refModel: "salesperson",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: salesperson,
      message: "Salesperson retrieved successfully",
    });
  },
);

export const updateSalesperson = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getSalespersonIdParam(req.params.id);

    const salesperson = await SalespersonService.updateSalesperson(
      id,
      req.body as UpdateSalespersonDTO,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "salesperson",
      refId: id,
      action: "updated",
      title: "Salesperson updated",
      description: `Updated profile for salesperson ${id}`,
      refModel: "salesperson",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: salesperson,
      message: "Salesperson updated successfully",
    });
  },
);

export const deleteSalesperson = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getSalespersonIdParam(req.params.id);

    const salesperson = await SalespersonService.deleteSalesperson(
      id,
      req.user!._id.toString(),
      req.user?.role,
    );

    // Create Audit Log
    await createLog({
      type: "salesperson",
      refId: id,
      action: "deleted",
      title: "Salesperson deleted",
      description: `Deleted salesperson ${id}`,
      refModel: "salesperson",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: salesperson,
      message: "Salesperson deleted successfully",
    });
  },
);
