"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const strict_1 = __importDefault(require("node:assert/strict"));
const mongoose_1 = __importDefault(require("mongoose"));
const catalog_model_1 = require("../modules/Website/Catalog/catalog.model");
const category_model_1 = require("../modules/Website/Category/category.model");
const catalog_service_1 = require("../modules/Website/Catalog/catalog.service");
const catalog_validation_1 = require("../modules/Website/Catalog/catalog.validation");
const catalog_migration_1 = require("../scripts/catalog-migration");
const id = new mongoose_1.default.Types.ObjectId();
const categories = [
    { _id: id, name: "Office Furniture", slug: "office-furniture" },
];
const originalFind = catalog_model_1.CatalogModel.find;
const originalFindById = catalog_model_1.CatalogModel.findById;
const originalExists = category_model_1.CategoryModel.exists;
(0, node_test_1.afterEach)(() => {
    catalog_model_1.CatalogModel.find = originalFind;
    catalog_model_1.CatalogModel.findById = originalFindById;
    category_model_1.CategoryModel.exists = originalExists;
    (0, catalog_service_1.invalidateCatalogCache)();
});
function captureFind() {
    const filters = [];
    const chain = {
        select: () => chain,
        sort: () => chain,
        limit: () => chain,
        populate: () => chain,
        lean: async () => [],
    };
    catalog_model_1.CatalogModel.find = ((filter) => {
        filters.push(filter);
        return chain;
    });
    return filters;
}
(0, node_test_1.test)("price range uses nested basePrice, including zero; category uses ObjectId and tag is literal", async () => {
    const filters = captureFind();
    await catalog_service_1.CatalogService.searchCatalog({
        category: String(id),
        tag: "desk.*",
        minPrice: 0,
        maxPrice: 100,
    });
    strict_1.default.deepEqual(filters[0]["pricing.basePrice"], { $gte: 0, $lte: 100 });
    strict_1.default.equal(filters[0].price, undefined);
    strict_1.default.equal(String(filters[0].category), String(id));
    strict_1.default.equal(filters[0].status, "PUBLISHED");
    const regex = filters[0].tags.$in[0];
    strict_1.default.ok(regex.test("desk.*"));
    strict_1.default.ok(!regex.test("desktop"));
});
(0, node_test_1.test)("invalid price bounds and invalid category never query the database", async () => {
    const filters = captureFind();
    for (const input of [
        { minPrice: NaN },
        { minPrice: -1 },
        { maxPrice: Infinity },
        { minPrice: 20, maxPrice: 10 },
        { category: "Office Furniture" },
    ])
        await strict_1.default.rejects(catalog_service_1.CatalogService.searchCatalog(input));
    strict_1.default.equal(filters.length, 0);
});
(0, node_test_1.test)("all merchandising feeds use nested flags and exclude unpublished records", async () => {
    const filters = captureFind();
    await catalog_service_1.CatalogService.fetchFeaturedCatalogs();
    await catalog_service_1.CatalogService.fetchBestSellingCatalogProducts();
    await catalog_service_1.CatalogService.fetchNewArrivalCatalogs();
    for (const [index, flag] of [
        "isFeatured",
        "isBestSeller",
        "isNewArrival",
    ].entries())
        strict_1.default.deepEqual(filters[index], {
            [`merchandising.${flag}`]: true,
            status: "PUBLISHED",
        });
});
(0, node_test_1.test)("catalog validation rejects legacy fields, dotted bypasses, bad SEO and negative pricing", () => {
    for (const input of [
        { price: 10 },
        { "pricing.basePrice": 10 },
        { pricing: { basePrice: -1 } },
        { seo: { metaTitle: "x".repeat(71) } },
        { specifications: { $bad: "value" } },
    ])
        strict_1.default.equal(catalog_validation_1.updateCatalogSchema.safeParse(input).success, false);
    strict_1.default.equal(catalog_validation_1.updateCatalogSchema.safeParse({
        pricing: { basePrice: 0 },
        specifications: {},
    }).success, true);
    strict_1.default.equal(catalog_validation_1.createCatalogSchema.safeParse({
        name: "Desk",
        slug: "desk",
        category: String(id),
        pricing: { basePrice: 0 },
    }).success, true);
});
(0, node_test_1.test)("partial nested update preserves siblings and empty specifications clears map", async () => {
    const doc = new catalog_model_1.CatalogModel({
        name: "Desk",
        slug: "desk",
        category: id,
        pricing: { basePrice: 10, compareAtPrice: 20 },
        seo: { metaTitle: "Desk", metaDescription: "A desk" },
        specifications: { Width: "1m" },
    });
    doc.save = async () => doc;
    doc.populate = async () => doc;
    catalog_model_1.CatalogModel.findById = (async () => doc);
    const result = await catalog_service_1.CatalogService.updateProduct(String(doc._id), {
        pricing: { basePrice: 0 },
        seo: { metaTitle: "New" },
        specifications: {},
    });
    strict_1.default.equal(result.pricing.basePrice, 0);
    strict_1.default.equal(result.pricing.compareAtPrice, 20);
    strict_1.default.equal(result.seo.metaDescription, "A desk");
    strict_1.default.deepEqual(result.specifications, {});
});
(0, node_test_1.test)("nonexistent category is rejected before creating a catalog document", async () => {
    category_model_1.CategoryModel.exists = (async () => null);
    await strict_1.default.rejects(catalog_service_1.CatalogService.createCatalog({
        name: "Desk",
        slug: "desk",
        description: "",
        category: String(id),
        pricing: { basePrice: 10 },
    }, "ADMIN"), /Category does not exist/);
});
(0, node_test_1.test)("migration retains IDs, media, timestamps and effective legacy sale price", async () => {
    const source = {
        _id: new mongoose_1.default.Types.ObjectId(),
        name: "Office Desk",
        slug: "office-desk",
        category: "Office Furniture",
        price: 1000,
        discount: 20,
        image: ["desk.jpg"],
        isBestSeller: true,
        inStock: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-02-01"),
    };
    const result = (0, catalog_migration_1.convertLegacyCatalog)(source, categories);
    strict_1.default.equal(result._id, source._id);
    strict_1.default.equal(result.category, id);
    strict_1.default.deepEqual(result.images, source.image);
    strict_1.default.deepEqual(result.pricing, {
        currency: "KES",
        basePrice: 800,
        compareAtPrice: 1000,
    });
    strict_1.default.equal(result.merchandising?.isBestSeller, true);
    strict_1.default.equal(result.status, "PUBLISHED");
    strict_1.default.equal(result.createdAt, source.createdAt);
    await new catalog_model_1.CatalogModel(result).validate();
    strict_1.default.deepEqual((0, catalog_migration_1.convertLegacyCatalog)(result, categories).pricing, result.pricing);
    strict_1.default.equal((0, catalog_migration_1.convertLegacyCatalog)({ ...source, inStock: false }, categories).status, "DRAFT");
});
(0, node_test_1.test)("migration rejects unresolved categories, invalid discounts and overlong SEO", () => {
    const source = {
        name: "Desk",
        slug: "desk",
        category: "Office Furniture",
        price: 0,
    };
    for (const bad of [
        { category: "Unknown" },
        { discount: 101 },
        { metaTitle: "x".repeat(71) },
    ])
        strict_1.default.throws(() => (0, catalog_migration_1.convertLegacyCatalog)({ ...source, ...bad }, categories));
});
(0, node_test_1.test)("AI input uses nested pricing and output enforces nested SEO character limits", async () => {
    const { generationInputSchema, generatedContentSchema } = await Promise.resolve().then(() => __importStar(require("../modules/Cohere/cohere.types")));
    strict_1.default.equal(generationInputSchema.safeParse({
        name: "Desk",
        category: String(id),
        price: 10,
    }).success, false);
    strict_1.default.equal(generationInputSchema.safeParse({
        name: "Desk",
        category: String(id),
        pricing: { basePrice: 0 },
    }).success, true);
    const output = {
        description: "Office desk",
        keyFeatures: [],
        tags: [],
        slug: "desk",
        seo: { metaTitle: "Desk", metaDescription: "Office furniture" },
    };
    strict_1.default.equal(generatedContentSchema.safeParse(output).success, true);
    strict_1.default.equal(generatedContentSchema.safeParse({
        ...output,
        seo: { ...output.seo, metaTitle: "x".repeat(71) },
    }).success, false);
    strict_1.default.equal(generatedContentSchema.safeParse({
        ...output,
        seo: { ...output.seo, metaDescription: "x".repeat(321) },
    }).success, false);
});
(0, node_test_1.test)("catalog routes separate slug and ID lookup and creation reaches its write handler", async () => {
    var _a;
    const previous = { ...process.env };
    // Router construction needs configuration but never opens external connections.
    for (const key of [
        "URI",
        "JWT_SECRET",
        "EMAIL_HOST",
        "EMAIL_USER",
        "EMAIL_PASS",
        "REDIS_URL",
        "FRONTEND_URL",
        "WEBSITE_URL",
        "DEPLOYED_WEBSITE_URL",
        "GEMINI_API_KEY",
        "PROJECT_NUMBER",
        "PROJECT_NAME",
        "NAME",
        "COHERE_API_KEY",
    ])
        (_a = process.env)[key] ?? (_a[key] = "catalog-test-placeholder");
    try {
        const { CatalogProductRouter } = await Promise.resolve().then(() => __importStar(require("../modules/Website/Catalog/catalog.routes")));
        const handlers = await Promise.resolve().then(() => __importStar(require("../modules/Website/Catalog/catalog.controller")));
        const routes = CatalogProductRouter().stack
            .map((entry) => entry.route)
            .filter(Boolean);
        const create = routes.find((route) => route.path === "/create-catalog-product");
        strict_1.default.equal(create.stack.at(-1).handle, handlers.createCatalog);
        strict_1.default.ok(!create.stack.some((entry) => entry.handle === handlers.fetchFeaturedCatalogs));
        strict_1.default.ok(routes.some((route) => route.path === "/get-catalog-product/:slug"));
        strict_1.default.ok(routes.some((route) => route.path === "/get-catalog-product-by-id/:id"));
        strict_1.default.ok(!routes.some((route) => route.path === "/get-catalog-product/:id"));
        const { globalErrorHandler } = await Promise.resolve().then(() => __importStar(require("../middleware/error.middleware")));
        const { BadRequestError } = await Promise.resolve().then(() => __importStar(require("../common/errors/BadRequestError")));
        let statusCode = 0;
        let body;
        const res = {
            status: (code) => {
                statusCode = code;
                return res;
            },
            json: (value) => {
                body = value;
                return res;
            },
        };
        globalErrorHandler(new BadRequestError("Invalid base price"), {}, res, (() => { }));
        strict_1.default.equal(statusCode, 400);
        strict_1.default.equal(body.message, "Invalid base price");
        const originalSearch = catalog_service_1.CatalogService.searchCatalog;
        let parameters;
        try {
            catalog_service_1.CatalogService.searchCatalog = async (input) => {
                parameters = input;
                return [];
            };
            await handlers.searchProduct({ query: { minPrice: "0", maxPrice: "100" } }, res, (error) => {
                throw error;
            });
            strict_1.default.equal(parameters.minPrice, 0);
            strict_1.default.equal(parameters.maxPrice, 100);
        }
        finally {
            catalog_service_1.CatalogService.searchCatalog = originalSearch;
        }
    }
    finally {
        process.env = previous;
    }
});
//# sourceMappingURL=catalog.test.js.map