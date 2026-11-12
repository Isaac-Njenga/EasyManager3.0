"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateCategories = migrateCategories;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const category_model_1 = require("../modules/Website/Category/category.model");
// Set to false only after reviewing the dry-run results
const DRY_RUN = true;
const categories = [
    { name: "Living Room Furniture", slug: "living-room", sortOrder: 1 },
    { name: "Bedroom Furniture", slug: "bedroom", sortOrder: 2 },
    { name: "Office Furniture", slug: "office-furniture", sortOrder: 3 },
    { name: "Outdoor Furniture", slug: "outdoor-furniture", sortOrder: 4 },
    { name: "Kitchen Furniture", slug: "kitchen", sortOrder: 5 },
    {
        name: "Second-hand Furniture",
        slug: "second-hand-furniture",
        sortOrder: 6,
    },
];
async function migrateCategories() {
    if (mongoose_1.default.connection.readyState !== 1) {
        throw new Error("MongoDB must be connected before running this migration.");
    }
    // Use the existing website collection.
    const websiteCollection = mongoose_1.default.connection.collection("website");
    console.log(`Starting category migration. DRY_RUN=${DRY_RUN}`);
    // First, inspect how many existing records match each category.
    for (const category of categories) {
        const count = await websiteCollection.countDocuments({
            category: category.name,
        });
        console.log(`${category.name}: ${count} catalogue records`);
    }
    if (DRY_RUN) {
        console.log("Dry run complete. No database records were changed.");
        return;
    }
    // Create or update the  category records.
    for (const category of categories) {
        await category_model_1.CategoryModel.updateOne({ slug: category.slug }, {
            $set: {
                name: category.name,
                sortOrder: category.sortOrder,
                status: "ACTIVE",
            },
        }, { upsert: true });
    }
    // Convert the old category strings into Category ObjectId references.
    //   for (const category of categories) {
    //     const categoryDocument = await CategoryModel.findOne({
    //       slug: category.slug,
    //     }).select("_id");
    //     if (!categoryDocument) {
    //       throw new Error(`Could not find category: ${category.name}`);
    //     }
    //     const result = await websiteCollection.updateMany(
    //       { category: category.name },
    //       {
    //         $set: {
    //           category: categoryDocument._id,
    //         },
    //       },
    //     );
    //     console.log(
    //       `${category.name}: migrated ${result.modifiedCount} catalogue records`,
    //     );
    //   }
    // Create the indexes defined in the Category schema.
    await category_model_1.CategoryModel.createIndexes();
    // Check whether any of the old string values remain.
    //   for (const category of categories) {
    //     const remaining = await websiteCollection.countDocuments({
    //       category: category.name,
    //     });
    //     if (remaining > 0) {
    //       console.warn(
    //         `${category.name}: ${remaining} records still have string categories`,
    //       );
    //     }
    //   }
    console.log("Category migration completed.");
}
async function main() {
    const mongoUri = env_1.env.URI;
    if (!mongoUri) {
        throw new Error("MONGODB_URI is missing from your environment variables.");
    }
    try {
        console.log("Connecting to MongoDB...");
        await mongoose_1.default.connect(mongoUri);
        console.log("Connected to MongoDB.");
        await migrateCategories();
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log("MongoDB connection closed.");
    }
}
main().catch((error) => {
    console.error("Category migration failed:", error);
    process.exitCode = 1;
});
//# sourceMappingURL=migrate-categories.js.map