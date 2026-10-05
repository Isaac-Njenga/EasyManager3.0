import dotenv from "dotenv";
import mongoose from "mongoose";
import { env } from "./env";
import { ProductModel } from "../modules/Products/product.model";

dotenv.config();

const uri = env.URI || "";

export async function connectToDB() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    });

    const database = mongoose.connection.db;
    if (!database) {
      throw new Error("Database connection is not available");
    }

    const productCollectionExists = await database
      .listCollections(
        { name: ProductModel.collection.name },
        { nameOnly: true },
      )
      .hasNext();

    if (productCollectionExists) {
      const productIndexes = await ProductModel.collection.indexes();
      for (const index of productIndexes) {
        const keys = Object.keys(index.key);
        if (index.unique && keys.length === 1 && index.key.code === 1) {
          await ProductModel.collection.dropIndex(index.name);
          console.log("Removed unique product-code index");
        }
      }
    }

    await ProductModel.createIndexes();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed!:", error);
    process.exit(1); // crash early (important)
  }
}