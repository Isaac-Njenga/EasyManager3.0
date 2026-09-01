import mongoose from "mongoose";
import crypto from "crypto";

const InventorySummarySchema = new mongoose.Schema(
  {
    totalProducts: { type: Number, required: false, default: 0 },
    totalItemsInStock: { type: Number, required: false, default: 0 },
    totalStockValue: { type: Number, required: false, default: 0 },
    lowStockItemsCount: { type: Number, required: false, default: 0 },
    outOfStockItemsCount: { type: Number, required: false, default: 0 },
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

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive", "Under Maintenance", "Full Capacity"],
      default: "Active",
    },
    warehouseCode: { type: String, unique: true },
    address: {
      building: { type: String, required: true },
      town: { type: String, required: true },
    },
    inventorySummary: InventorySummarySchema,
    inventoryItems: [InventoryItemSchema],
    notes: { type: String, required: false },
  },
  { collection: "warehouses", timestamps: true },
);

function generateWarehouseCode(name = ""): string {
  const namePrefix = name ? name.substring(0, 3).toUpperCase() : "GEN";
  const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `WH-${namePrefix}-${randomSuffix}`;

  // Option B: Pure sequential counter/hash if preferred
  // return `WH-${Math.floor(100000 + Math.random() * 900000)}`;
}

// Pre-save hook to generate and verify unique warehouseCode
warehouseSchema.pre("save", async function () {
  // Only generate code if it hasn't been set yet or if this is a new document
  if (!this.warehouseCode) {
    let isUnique = false;
    let candidateCode = "";
    let attempts = 0;
    const maxAttempts = 10;

    // Retry loop to ensure uniqueness
    while (!isUnique && attempts < maxAttempts) {
      candidateCode = generateWarehouseCode(this.name);

      // Check MongoDB if candidateCode exists
      const existingWarehouse = await mongoose.models.Warehouse.findOne({
        warehouseCode: candidateCode,
      });

      if (!existingWarehouse) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error(
        "Failed to generate a unique warehouse code after multiple attempts.",
      );
    }

    this.warehouseCode = candidateCode;
  }
});

export const WarehouseModel = mongoose.model("Warehouse", warehouseSchema);
