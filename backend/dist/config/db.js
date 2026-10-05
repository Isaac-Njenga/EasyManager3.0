"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = connectToDB;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const product_model_1 = require("../modules/Products/product.model");
dotenv_1.default.config();
const uri = env_1.env.URI || "";
async function connectToDB() {
    try {
        await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            retryWrites: true,
            retryReads: true,
        });
        const database = mongoose_1.default.connection.db;
        if (!database) {
            throw new Error("Database connection is not available");
        }
        const productCollectionExists = await database
            .listCollections({ name: product_model_1.ProductModel.collection.name }, { nameOnly: true })
            .hasNext();
        if (productCollectionExists) {
            const productIndexes = await product_model_1.ProductModel.collection.indexes();
            for (const index of productIndexes) {
                const keys = Object.keys(index.key);
                if (index.unique && keys.length === 1 && index.key.code === 1) {
                    await product_model_1.ProductModel.collection.dropIndex(index.name);
                    console.log("Removed unique product-code index");
                }
            }
        }
        await product_model_1.ProductModel.createIndexes();
        console.log("Database connected");
    }
    catch (error) {
        console.error("Database connection failed!:", error);
        process.exit(1); // crash early (important)
    }
}
//# sourceMappingURL=db.js.map