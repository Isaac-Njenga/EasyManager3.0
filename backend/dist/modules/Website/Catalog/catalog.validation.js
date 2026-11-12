"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCatalogSchema = exports.createCatalogSchema = exports.seoSchema = exports.objectId = void 0;
exports.parseCatalogInput = parseCatalogInput;
const zod_1 = require("zod");
const BadRequestError_1 = require("../../../common/errors/BadRequestError");
exports.objectId = zod_1.z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid category ID");
const strings = zod_1.z.array(zod_1.z.string().trim());
const pricing = zod_1.z.strictObject({
    currency: zod_1.z.string().trim().min(1).optional(),
    basePrice: zod_1.z.number().finite().nonnegative(),
    compareAtPrice: zod_1.z.number().finite().nonnegative().nullable().optional(),
});
const merchandising = zod_1.z.strictObject({
    isFeatured: zod_1.z.boolean().optional(),
    isBestSeller: zod_1.z.boolean().optional(),
    isNewArrival: zod_1.z.boolean().optional(),
    sortOrder: zod_1.z.number().finite().optional(),
});
exports.seoSchema = zod_1.z.strictObject({
    metaTitle: zod_1.z.string().trim().max(70).optional(),
    metaDescription: zod_1.z.string().trim().max(320).optional(),
});
exports.createCatalogSchema = zod_1.z.strictObject({
    name: zod_1.z.string().trim().min(1),
    slug: zod_1.z.string().trim().toLowerCase().min(1),
    description: zod_1.z.string().trim().optional(),
    category: exports.objectId,
    tags: strings.optional(),
    images: strings.optional(),
    colours: strings.optional(),
    keyFeatures: strings.optional(),
    specifications: zod_1.z
        .record(zod_1.z
        .string()
        .min(1)
        .refine((k) => !/[.$]/.test(k) &&
        !["__proto__", "constructor", "prototype"].includes(k), "Invalid specification key"), zod_1.z.string())
        .optional(),
    pricing,
    merchandising: merchandising.optional(),
    status: zod_1.z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    seo: exports.seoSchema.optional(),
});
exports.updateCatalogSchema = exports.createCatalogSchema
    .partial()
    .extend({ pricing: pricing.partial().optional() })
    .refine((data) => Object.keys(data).length > 0, "Update data is required");
function parseCatalogInput(schema, input) {
    const result = schema.safeParse(input);
    if (!result.success)
        throw new BadRequestError_1.BadRequestError(result.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "));
    return result.data;
}
//# sourceMappingURL=catalog.validation.js.map