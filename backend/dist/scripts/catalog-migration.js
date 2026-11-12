"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertLegacyCatalog = convertLegacyCatalog;
const catalog_validation_1 = require("../modules/Website/Catalog/catalog.validation");
const normalize = (value) => value.trim().toLowerCase();
function convertLegacyCatalog(source, categories) {
    const value = source.category?._id ?? source.category;
    const aliases = {
        "second-hand items": "second-hand-furniture",
    };
    const key = normalize(String(value ?? ""));
    const category = categories.find((c) => String(c._id) === key ||
        normalize(c.name) === key ||
        normalize(c.slug) === (aliases[key] ?? key));
    if (!category)
        throw new Error(`Unresolved category: ${String(value)}`);
    const discount = source.discount ?? 0;
    if (typeof discount !== "number" ||
        !Number.isFinite(discount) ||
        discount < 0 ||
        discount > 100)
        throw new Error("Invalid legacy discount");
    const legacyPrice = source.price;
    const hasPricing = source.pricing?.basePrice !== undefined;
    if (!hasPricing &&
        (typeof legacyPrice !== "number" ||
            !Number.isFinite(legacyPrice) ||
            legacyPrice < 0))
        throw new Error("Invalid legacy price");
    const slug = String(source.slug ?? source.name ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const data = (0, catalog_validation_1.parseCatalogInput)(catalog_validation_1.createCatalogSchema, {
        name: source.name,
        slug,
        description: source.description ?? "",
        category: String(category._id),
        images: source.images ?? source.image ?? [],
        colours: source.colours ?? [],
        tags: source.tags ?? [],
        keyFeatures: source.keyFeatures ?? [],
        specifications: source.specifications ?? {},
        pricing: hasPricing
            ? source.pricing
            : {
                currency: "KES",
                basePrice: Math.round(legacyPrice * (1 - discount / 100) * 100) / 100,
                compareAtPrice: discount > 0 ? legacyPrice : null,
            },
        merchandising: source.merchandising ?? {
            isFeatured: source.isFeatured ?? false,
            isBestSeller: source.isBestSeller ?? false,
            isNewArrival: source.isNewArrival ?? false,
            sortOrder: 0,
        },
        status: source.status ?? (source.inStock === false ? "DRAFT" : "PUBLISHED"),
        seo: source.seo ?? {
            metaTitle: source.metaTitle ?? "",
            metaDescription: source.metaDescription ?? "",
        },
    });
    return {
        ...data,
        category: category._id,
        _id: source._id,
        createdAt: source.createdAt ?? new Date(),
        updatedAt: source.updatedAt ?? new Date(),
    };
}
//# sourceMappingURL=catalog-migration.js.map