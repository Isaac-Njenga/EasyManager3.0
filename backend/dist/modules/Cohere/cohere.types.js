"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatedContentSchema = exports.generationInputSchema = void 0;
const zod_1 = require("zod");
const catalog_validation_1 = require("../Website/Catalog/catalog.validation");
exports.generationInputSchema = zod_1.z.strictObject({
    name: zod_1.z.string().trim().min(1),
    category: catalog_validation_1.objectId,
    pricing: zod_1.z.strictObject({
        basePrice: zod_1.z.number().finite().nonnegative(),
        currency: zod_1.z.string().trim().min(1).optional(),
    }),
    colours: zod_1.z.array(zod_1.z.string()).optional(),
    keyFeatures: zod_1.z.array(zod_1.z.string()).optional(),
    specifications: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
});
exports.generatedContentSchema = zod_1.z.strictObject({
    description: zod_1.z.string().trim().min(1),
    keyFeatures: zod_1.z.array(zod_1.z.string().trim().min(1)).max(5),
    tags: zod_1.z.array(zod_1.z.string().trim().min(1)).max(8),
    slug: zod_1.z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    seo: catalog_validation_1.seoSchema.required(),
});
//# sourceMappingURL=cohere.types.js.map