"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const catalog_model_1 = require("../modules/Website/Catalog/catalog.model");
const category_model_1 = require("../modules/Website/Category/category.model");
const catalog_migration_1 = require("./catalog-migration");
async function main() {
    const args = process.argv.slice(2);
    if (args.some((arg) => !["--apply", "--dry-run"].includes(arg)) ||
        (args.includes("--apply") && args.includes("--dry-run")))
        throw new Error("Use --dry-run (default) or --apply");
    const apply = args.includes("--apply");
    if (!process.env.URI)
        throw new Error("URI is required");
    await mongoose_1.default.connect(process.env.URI, {
        autoCreate: false,
        autoIndex: false,
    });
    try {
        const db = mongoose_1.default.connection.db;
        const categories = await category_model_1.CategoryModel.find().lean();
        const target = db.collection("catalog");
        const existing = await target.find().toArray();
        const ids = new Set(existing.map((doc) => String(doc._id)));
        const slugs = new Map();
        const pending = [];
        const errors = [];
        let skipped = 0;
        // Validate destination records too, but never overwrite existing catalog edits from website.
        for (const doc of existing) {
            try {
                const normalized = (0, catalog_migration_1.convertLegacyCatalog)(doc, categories);
                const slug = normalized.slug;
                if (slugs.has(slug) && slugs.get(slug) !== String(doc._id))
                    throw new Error(`Duplicate slug: ${slug}`);
                slugs.set(slug, String(doc._id));
                if ([
                    "image",
                    "price",
                    "discount",
                    "inStock",
                    "isFeatured",
                    "isBestSeller",
                    "isNewArrival",
                    "metaTitle",
                    "metaDescription",
                    "shortDescription",
                ].some((key) => Object.prototype.hasOwnProperty.call(doc, key)) ||
                    [
                        "description",
                        "tags",
                        "colours",
                        "keyFeatures",
                        "specifications",
                        "status",
                    ].some((key) => doc[key] === undefined) ||
                    doc.pricing?.currency === undefined ||
                    doc.pricing?.compareAtPrice === undefined ||
                    ["isFeatured", "isBestSeller", "isNewArrival", "sortOrder"].some((key) => doc.merchandising?.[key] === undefined) ||
                    !doc.pricing ||
                    !doc.merchandising ||
                    !doc.seo ||
                    typeof doc.category === "string" ||
                    !doc.images ||
                    doc.slug !== slug)
                    pending.push(normalized);
            }
            catch (error) {
                errors.push(`catalog/${doc._id}: ${error instanceof Error ? error.message : error}`);
            }
        }
        for await (const doc of db.collection("website").find()) {
            if (ids.has(String(doc._id))) {
                skipped++;
                continue;
            }
            try {
                const normalized = (0, catalog_migration_1.convertLegacyCatalog)(doc, categories);
                if (slugs.has(normalized.slug))
                    throw new Error(`Slug collision: ${normalized.slug}`);
                slugs.set(normalized.slug, String(doc._id));
                pending.push(normalized);
            }
            catch (error) {
                errors.push(`website/${doc._id}: ${error instanceof Error ? error.message : error}`);
            }
        }
        // Full preflight before any writes, including Mongoose defaults and schema validation.
        for (const doc of pending) {
            try {
                await new catalog_model_1.CatalogModel(doc).validate();
            }
            catch (error) {
                errors.push(`${doc._id}: ${error instanceof Error ? error.message : error}`);
            }
        }
        console.log(JSON.stringify({
            mode: apply ? "apply" : "dry-run",
            planned: pending.length,
            skippedExisting: skipped,
            errors,
        }, null, 2));
        if (errors.length)
            throw new Error("Migration preflight failed. No records were written.");
        if (!apply)
            return;
        // Build required unique and text indexes explicitly (autoIndex is disabled).
        await catalog_model_1.CatalogModel.createIndexes();
        for (const doc of pending) {
            const { _id, ...fields } = new catalog_model_1.CatalogModel(doc).toObject({
                flattenMaps: true,
            });
            // Idempotent inserts; normalize legacy destination records only when they still match their preflight version.
            if (ids.has(String(_id))) {
                const previous = existing.find((entry) => String(entry._id) === String(_id));
                const result = await target.replaceOne({ _id, updatedAt: previous.updatedAt }, { _id, ...fields });
                if (!result.matchedCount)
                    throw new Error(`Catalog ${_id} changed during migration. Re-run dry-run.`);
            }
            else
                await target.updateOne({ _id }, { $setOnInsert: fields }, { upsert: true });
        }
        console.log(`Catalog migration complete. ${pending.length} records processed. Website collection retained.`);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
//# sourceMappingURL=migrate-catalog.js.map