import { Request, Response, NextFunction } from "express";
import { generateProductDescription } from "./cohere.service";

export async function handleGenerateDescription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, category, colours, price } = req.body;

    if (!name || !category || price === undefined) {
      res.status(400).json({
        error:
          "Missing required fields: name, category, and price are required.",
      });
      return;
    }

    const result = await generateProductDescription({
      name,
      category,
      colours,
      price: Number(price),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
