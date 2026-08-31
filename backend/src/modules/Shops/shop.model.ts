import mongoose from "mongoose";
import crypto from "crypto";

const InventorySummarySchema = new mongoose.Schema(
  {
    totalProducts: { type: Number, required: false, default: 0 },
    totalItemsInStock: { type: Number, required: false, default: 0 },
    totalStockValue: { type: Number, required: false, default: 0 },
    lowStockItemsCount: { type: Number, required: false, default: 0 },
  },
  { _id: false },
);

const InventoryItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive", "Under Maintenance"],
      default: "Active",
    },
    shopCode: { type: String, unique: true },
    type: { type: String, required: true, enum: ["Retail Store", "Showroom"] },
    address: {
      building: { type: String, required: true },
      town: { type: String, required: true },
    },
    inventorySummary: InventorySummarySchema,
    inventoryItems: [InventoryItemSchema],
    notes: { type: String, required: false },
  },
  { collection: "shops", timestamps: true },
);

// Code Generator Function
function generateShopCode(name = ""): string {
  const namePrefix = name ? name.substring(0, 3).toUpperCase() : "GEN";
  const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `SHP-${namePrefix}-${randomSuffix}`;

  // Option B: Pure sequential counter/hash if preferred
  // return `SHP-${Math.floor(100000 + Math.random() * 900000)}`;
}

// Pre-save hook to generate and verify unique shopCode
shopSchema.pre("save", async function () {
  // Only generate code if it hasn't been set yet or if this is a new document
  if (!this.shopCode) {
    let isUnique = false;
    let candidateCode = "";
    let attempts = 0;
    const maxAttempts = 10;

    // Retry loop to ensure uniqueness
    while (!isUnique && attempts < maxAttempts) {
      candidateCode = generateShopCode(this.name);

      // Check MongoDB if candidateCode exists
      const existingShop = await mongoose.models.Shop.findOne({
        shopCode: candidateCode,
      });

      if (!existingShop) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error(
        "Failed to generate a unique shop code after multiple attempts.",
      );
    }

    this.shopCode = candidateCode;
  }
});

export const ShopModel = mongoose.model("Shop", shopSchema);
