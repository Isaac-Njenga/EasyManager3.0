# Website to catalog migration

Run from `backend`, with `URI` set in the environment or `.env`:

```sh
npm run migrate:catalog -- --dry-run
npm run migrate:catalog -- --apply
```

The default is dry-run. Stop writes to website and catalog while applying, and back up the database first. Preflight validates every planned record and checks destination records, category references, SEO limits, prices and slug collisions before writing. Resolve reported errors and repeat dry-run. Apply explicitly creates catalog indexes (including unique slug and text search). Run dry-run again after applying; website records with existing catalog IDs are skipped. A failed apply can be rerun; earlier successful records are retained. The migration is not a multi-document transaction.

The script copies `website` into `catalog`, preserving IDs and timestamps, and normalizes legacy-shaped records already in catalog. Existing catalog records win over website copies. It never drops or changes website or reseeds categories. Category names, slugs, and ObjectIds resolve against the seeded category documents; `Second-Hand Items` maps to `second-hand-furniture`. Unknown categories and duplicate slugs stop preflight.

`image` becomes `images`; merchandising flags and SEO fields become nested. Legacy `price * (1 - discount / 100)` becomes `pricing.basePrice`, rounded to cents; the original price becomes `compareAtPrice` when discounted. Already nested prices are preserved. Legacy `inStock: false` becomes DRAFT; other legacy items become PUBLISHED. Existing statuses are preserved. Review these drafts before publishing because catalog has no inventory field. Stock and discount data remain in website for reference.

The admin frontend keeps its `/website` page URLs while using `/catalog` APIs. The old `/web-product` API remains for existing consumers and still reads website; switch external consumers to `/catalog` during rollout. Catalog public list, slug, search and merchandising feeds return PUBLISHED items. Admin listing and ID lookup require authentication. The distinct ID route is `/catalog/get-catalog-product-by-id/:id`; `/catalog/get-catalog-product/:slug` is the public slug route. `/category` returns active seeded categories.

After verification, deploy the catalog-backed frontend and API together. Retain website until all external clients have moved and the rollback window has passed. Do not continue accepting legacy writes after cutover; this migration intentionally does not overwrite existing catalog changes from website on rerun.
