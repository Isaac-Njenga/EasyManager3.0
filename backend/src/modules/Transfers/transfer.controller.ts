import { Response } from "express";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { createLog } from "../Logs/logs.service";
import { TransferService } from "./transfer.service";
import {
  CreateInventoryTransferDTO as CreateTransferDTO,
  UpdateInventoryTransferDTO as UpdateTransferDTO,
} from "./transfer.types";

const gettransferIdParam = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new BadRequestError("transfer ID is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createTransfer = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.body) {
      throw new BadRequestError("Request body is required");
    }

    const transfer = await TransferService.createTransfer(
      req.body as CreateTransferDTO,
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "transfer",
      refId: transfer._id.toString(),
      action: "created",
      title: "transfer created",
      description: `New transfer: '${transfer.type}' was initiated`,
      refModel: "transfer",
      actor: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: transfer,
      message: "Transfer created successfully",
    });
  },
);

export const fetchTransfers = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const transfers = await TransferService.fetchTransfers({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    res.status(200).json({
      success: true,
      data: transfers,
      message: "Transfers fetched successfully",
    });
  },
);

export const fetchTransferById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = gettransferIdParam(req.params.id);

    const transfer = await TransferService.fetchTransferById(
      id,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "transfer",
      refId: id,
      action: "received",
      title: "Transfer profile retrieved",
      description: `Fetched profile for transfer ${id}`,
      refModel: "transfer",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: transfer,
      message: "Transfer retrieved successfully",
    });
  },
);

export const updateTransfer = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = gettransferIdParam(req.params.id);

    const transfer = await TransferService.updateTransfer(
      id,
      req.body as UpdateTransferDTO,
      req.user!._id.toString(),
      req.user!.role,
    );

    // Create Audit Log
    await createLog({
      type: "transfer",
      refId: id,
      action: "updated",
      title: "Transfer updated",
      description: `Updated profile for transfer ${id}`,
      refModel: "transfer",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: transfer,
      message: "Transfer updated successfully",
    });
  },
);

export const deleteTransfer = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = gettransferIdParam(req.params.id);

    const transfer = await TransferService.deleteTransfer(
      id,
      req.user!._id.toString(),
      req.user?.role,
    );

    // Create Audit Log
    await createLog({
      type: "transfer",
      refId: id,
      action: "deleted",
      title: "Transfer deleted",
      description: `Deleted transfer ${id}`,
      refModel: "transfer",
      actor: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: transfer,
      message: "Transfer deleted successfully",
    });
  },
);
