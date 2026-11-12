import { z } from "zod";
import { BadRequestError } from "../../../common/errors/BadRequestError";
export const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid category ID");
const strings = z.array(z.string().trim());
const pricing = z.strictObject({
  currency: z.string().trim().min(1).optional(),
  basePrice: z.number().finite().nonnegative(),
  compareAtPrice: z.number().finite().nonnegative().nullable().optional(),
});
const merchandising = z.strictObject({
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  sortOrder: z.number().finite().optional(),
});
export const seoSchema = z.strictObject({
  metaTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(320).optional(),
});
export const createCatalogSchema = z.strictObject({
  name: z.string().trim().min(1),
  slug: z.string().trim().toLowerCase().min(1),
  description: z.string().trim().optional(),
  category: objectId,
  tags: strings.optional(),
  images: strings.optional(),
  colours: strings.optional(),
  keyFeatures: strings.optional(),
  specifications: z
    .record(
      z
        .string()
        .min(1)
        .refine(
          (k) =>
            !/[.$]/.test(k) &&
            !["__proto__", "constructor", "prototype"].includes(k),
          "Invalid specification key",
        ),
      z.string(),
    )
    .optional(),
  pricing,
  merchandising: merchandising.optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  seo: seoSchema.optional(),
});
export const updateCatalogSchema = createCatalogSchema
  .partial()
  .extend({ pricing: pricing.partial().optional() })
  .refine((data) => Object.keys(data).length > 0, "Update data is required");
export function parseCatalogInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success)
    throw new BadRequestError(
      result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    );
  return result.data;
}
