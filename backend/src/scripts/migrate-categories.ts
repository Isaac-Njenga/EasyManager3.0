import mongoose from "mongoose";
import { env } from "../config/env";
import { CategoryModel } from "../modules/Website/Category/category.model";

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

export async function migrateCategories() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB must be connected before running this migration.");
  }

  // Use the existing website collection.
  const websiteCollection = mongoose.connection.collection("website");

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
    await CategoryModel.updateOne(
      { slug: category.slug },
      {
        $set: {
          name: category.name,
          sortOrder: category.sortOrder,
          status: "ACTIVE",
        },
      },
      { upsert: true },
    );
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
  await CategoryModel.createIndexes();

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
  const mongoUri = env.URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from your environment variables.");
  }

  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB.");

    await migrateCategories();
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

main().catch((error) => {
  console.error("Category migration failed:", error);
  process.exitCode = 1;
});
