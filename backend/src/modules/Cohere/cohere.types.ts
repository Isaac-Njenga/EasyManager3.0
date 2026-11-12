import { z } from "zod";
import { objectId, seoSchema } from "../Website/Catalog/catalog.validation";
export const generationInputSchema = z.strictObject({
  name: z.string().trim().min(1),
  category: objectId,
  pricing: z.strictObject({
    basePrice: z.number().finite().nonnegative(),
    currency: z.string().trim().min(1).optional(),
  }),
  colours: z.array(z.string()).optional(),
  keyFeatures: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
});
export const generatedContentSchema = z.strictObject({
  description: z.string().trim().min(1),
  keyFeatures: z.array(z.string().trim().min(1)).max(5),
  tags: z.array(z.string().trim().min(1)).max(8),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  seo: seoSchema.required(),
});
export type GenerateDescriptionInput = z.infer<typeof generationInputSchema>;
export type GeneratedDescriptionResponse = z.infer<
  typeof generatedContentSchema
>;
