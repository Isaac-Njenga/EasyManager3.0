import { Response } from "express";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { createLog } from "../Logs/logs.service";
import { WarehouseService } from "./warehouse.service";
import { CreateWarehouseDTO, UpdateWarehouseDTO } from "./warehouse.types";

const getWarehouseIdParam = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new BadRequestError("Warehouse ID is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createWarehouse = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const warehouse = await WarehouseService.createWarehouse(
      req.body as CreateWarehouseDTO,
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "warehouse",
      refId: warehouse._id.toString(),
      action: "created",
      title: "Warehouse created",
      description: `New warehouse: '${warehouse.name}' was created`,
      refModel: "warehouse",
      actor: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: warehouse,
      message: "Warehouse created successfully",
    });
  },
);

export const fetchWarehouses = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const warehouses = await WarehouseService.fetchWarehouses({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: req.query.search as string,
      status: req.query.status as string,
    });

    res.status(200).json({
      success: true,
      data: warehouses,
      message: "Warehouses fetched successfully",
    });
  },
);

export const fetchWarehouseById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getWarehouseIdParam(req.params.id);

    const warehouse = await WarehouseService.fetchWarehouseById(
      id,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "warehouse",
      refId: id,
      action: "received",
      title: "Warehouse profile retrieved",
      description: `Fetched profile for warehouse ${id}`,
      refModel: "warehouse", 
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: warehouse,
      message: "Warehouse retrieved successfully",
    });
  },
);

export const updateWarehouse = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getWarehouseIdParam(req.params.id);

    const warehouse = await WarehouseService.updateWarehouse(
      id,
      req.body as UpdateWarehouseDTO,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "warehouse",
      refId: id,
      action: "updated",
      title: "Warehouse updated",
      description: `Updated profile for warehouse ${id}`,
      refModel: "warehouse",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: warehouse,
      message: "Warehouse updated successfully",
    });
  },
);

export const deleteWarehouse = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = getWarehouseIdParam(req.params.id);

    const warehouse = await WarehouseService.deleteWarehouse(
      id,
      req.user!._id.toString(),
      req.user?.role,
    );

    // Create Audit Log
    await createLog({
      type: "warehouse",
      refId: id,
      action: "deleted",
      title: "Warehouse deleted",
      description: `Deleted warehouse ${id}`,
      refModel: "warehouse",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: warehouse,
      message: "Warehouse deleted successfully",
    });
  },
);
