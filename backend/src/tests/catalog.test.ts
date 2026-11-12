import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { CatalogModel } from "../modules/Website/Catalog/catalog.model";
import { CategoryModel } from "../modules/Website/Category/category.model";
import {
  CatalogService,
  invalidateCatalogCache,
} from "../modules/Website/Catalog/catalog.service";
import {
  createCatalogSchema,
  updateCatalogSchema,
} from "../modules/Website/Catalog/catalog.validation";
import { convertLegacyCatalog } from "../scripts/catalog-migration";
const id = new mongoose.Types.ObjectId();
const categories = [
  { _id: id, name: "Office Furniture", slug: "office-furniture" },
];
const originalFind = CatalogModel.find;
const originalFindById = CatalogModel.findById;
const originalExists = CategoryModel.exists;
afterEach(() => {
  CatalogModel.find = originalFind;
  CatalogModel.findById = originalFindById;
  CategoryModel.exists = originalExists;
  invalidateCatalogCache();
});
function captureFind() {
  const filters: any[] = [];
  const chain: any = {
    select: () => chain,
    sort: () => chain,
    limit: () => chain,
    populate: () => chain,
    lean: async () => [],
  };
  CatalogModel.find = ((filter: any) => {
    filters.push(filter);
    return chain;
  }) as any;
  return filters;
}
test("price range uses nested basePrice, including zero; category uses ObjectId and tag is literal", async () => {
  const filters = captureFind();
  await CatalogService.searchCatalog({
    category: String(id),
    tag: "desk.*",
    minPrice: 0,
    maxPrice: 100,
  });
  assert.deepEqual(filters[0]["pricing.basePrice"], { $gte: 0, $lte: 100 });
  assert.equal(filters[0].price, undefined);
  assert.equal(String(filters[0].category), String(id));
  assert.equal(filters[0].status, "PUBLISHED");
  const regex = filters[0].tags.$in[0];
  assert.ok(regex.test("desk.*"));
  assert.ok(!regex.test("desktop"));
});
test("invalid price bounds and invalid category never query the database", async () => {
  const filters = captureFind();
  for (const input of [
    { minPrice: NaN },
    { minPrice: -1 },
    { maxPrice: Infinity },
    { minPrice: 20, maxPrice: 10 },
    { category: "Office Furniture" },
  ])
    await assert.rejects(CatalogService.searchCatalog(input));
  assert.equal(filters.length, 0);
});
test("all merchandising feeds use nested flags and exclude unpublished records", async () => {
  const filters = captureFind();
  await CatalogService.fetchFeaturedCatalogs();
  await CatalogService.fetchBestSellingCatalogProducts();
  await CatalogService.fetchNewArrivalCatalogs();
  for (const [index, flag] of [
    "isFeatured",
    "isBestSeller",
    "isNewArrival",
  ].entries())
    assert.deepEqual(filters[index], {
      [`merchandising.${flag}`]: true,
      status: "PUBLISHED",
    });
});
test("catalog validation rejects legacy fields, dotted bypasses, bad SEO and negative pricing", () => {
  for (const input of [
    { price: 10 },
    { "pricing.basePrice": 10 },
    { pricing: { basePrice: -1 } },
    { seo: { metaTitle: "x".repeat(71) } },
    { specifications: { $bad: "value" } },
  ])
    assert.equal(updateCatalogSchema.safeParse(input).success, false);
  assert.equal(
    updateCatalogSchema.safeParse({
      pricing: { basePrice: 0 },
      specifications: {},
    }).success,
    true,
  );
  assert.equal(
    createCatalogSchema.safeParse({
      name: "Desk",
      slug: "desk",
      category: String(id),
      pricing: { basePrice: 0 },
    }).success,
    true,
  );
});
test("partial nested update preserves siblings and empty specifications clears map", async () => {
  const doc = new CatalogModel({
    name: "Desk",
    slug: "desk",
    category: id,
    pricing: { basePrice: 10, compareAtPrice: 20 },
    seo: { metaTitle: "Desk", metaDescription: "A desk" },
    specifications: { Width: "1m" },
  });
  (doc as any).save = async () => doc;
  (doc as any).populate = async () => doc;
  CatalogModel.findById = (async () => doc) as any;
  const result = await CatalogService.updateProduct(String(doc._id), {
    pricing: { basePrice: 0 },
    seo: { metaTitle: "New" },
    specifications: {},
  });
  assert.equal(result.pricing.basePrice, 0);
  assert.equal(result.pricing.compareAtPrice, 20);
  assert.equal(result.seo.metaDescription, "A desk");
  assert.deepEqual(result.specifications, {});
});
test("nonexistent category is rejected before creating a catalog document", async () => {
  CategoryModel.exists = (async () => null) as any;
  await assert.rejects(
    CatalogService.createCatalog(
      {
        name: "Desk",
        slug: "desk",
        description: "",
        category: String(id),
        pricing: { basePrice: 10 },
      },
      "ADMIN",
    ),
    /Category does not exist/,
  );
});
test("migration retains IDs, media, timestamps and effective legacy sale price", async () => {
  const source = {
    _id: new mongoose.Types.ObjectId(),
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
  const result = convertLegacyCatalog(source, categories);
  assert.equal(result._id, source._id);
  assert.equal(result.category, id);
  assert.deepEqual(result.images, source.image);
  assert.deepEqual(result.pricing, {
    currency: "KES",
    basePrice: 800,
    compareAtPrice: 1000,
  });
  assert.equal(result.merchandising?.isBestSeller, true);
  assert.equal(result.status, "PUBLISHED");
  assert.equal(result.createdAt, source.createdAt);
  await new CatalogModel(result).validate();
  assert.deepEqual(
    convertLegacyCatalog(result, categories).pricing,
    result.pricing,
  );
  assert.equal(
    convertLegacyCatalog({ ...source, inStock: false }, categories).status,
    "DRAFT",
  );
});
test("migration rejects unresolved categories, invalid discounts and overlong SEO", () => {
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
    assert.throws(() =>
      convertLegacyCatalog({ ...source, ...bad }, categories),
    );
});

test("AI input uses nested pricing and output enforces nested SEO character limits", async () => {
  const { generationInputSchema, generatedContentSchema } =
    await import("../modules/Cohere/cohere.types");
  assert.equal(
    generationInputSchema.safeParse({
      name: "Desk",
      category: String(id),
      price: 10,
    }).success,
    false,
  );
  assert.equal(
    generationInputSchema.safeParse({
      name: "Desk",
      category: String(id),
      pricing: { basePrice: 0 },
    }).success,
    true,
  );
  const output = {
    description: "Office desk",
    keyFeatures: [],
    tags: [],
    slug: "desk",
    seo: { metaTitle: "Desk", metaDescription: "Office furniture" },
  };
  assert.equal(generatedContentSchema.safeParse(output).success, true);
  assert.equal(
    generatedContentSchema.safeParse({
      ...output,
      seo: { ...output.seo, metaTitle: "x".repeat(71) },
    }).success,
    false,
  );
  assert.equal(
    generatedContentSchema.safeParse({
      ...output,
      seo: { ...output.seo, metaDescription: "x".repeat(321) },
    }).success,
    false,
  );
});

test("catalog routes separate slug and ID lookup and creation reaches its write handler", async () => {
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
    process.env[key] ??= "catalog-test-placeholder";
  try {
    const { CatalogProductRouter } =
      await import("../modules/Website/Catalog/catalog.routes");
    const handlers =
      await import("../modules/Website/Catalog/catalog.controller");
    const routes = (CatalogProductRouter() as any).stack
      .map((entry: any) => entry.route)
      .filter(Boolean);
    const create = routes.find(
      (route: any) => route.path === "/create-catalog-product",
    );
    assert.equal(create.stack.at(-1).handle, handlers.createCatalog);
    assert.ok(
      !create.stack.some(
        (entry: any) => entry.handle === handlers.fetchFeaturedCatalogs,
      ),
    );
    assert.ok(
      routes.some((route: any) => route.path === "/get-catalog-product/:slug"),
    );
    assert.ok(
      routes.some(
        (route: any) => route.path === "/get-catalog-product-by-id/:id",
      ),
    );
    assert.ok(
      !routes.some((route: any) => route.path === "/get-catalog-product/:id"),
    );

    const { globalErrorHandler } =
      await import("../middleware/error.middleware");
    const { BadRequestError } =
      await import("../common/errors/BadRequestError");
    let statusCode = 0;
    let body: any;
    const res: any = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (value: any) => {
        body = value;
        return res;
      },
    };
    globalErrorHandler(
      new BadRequestError("Invalid base price"),
      {} as any,
      res,
      (() => {}) as any,
    );
    assert.equal(statusCode, 400);
    assert.equal(body.message, "Invalid base price");
    const originalSearch = CatalogService.searchCatalog;
    let parameters: any;
    try {
      CatalogService.searchCatalog = async (input) => {
        parameters = input;
        return [];
      };
      await handlers.searchProduct(
        { query: { minPrice: "0", maxPrice: "100" } } as any,
        res,
        (error) => {
          throw error;
        },
      );
      assert.equal(parameters.minPrice, 0);
      assert.equal(parameters.maxPrice, 100);
    } finally {
      CatalogService.searchCatalog = originalSearch;
    }
  } finally {
    process.env = previous;
  }
});
