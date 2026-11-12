import { Request, Response, NextFunction } from "express";
import { generateProductDescription } from "./cohere.service";

export async function handleGenerateDescription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await generateProductDescription(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
