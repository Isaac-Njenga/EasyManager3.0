import mongoose from "mongoose";

const LocationStockSchema = new mongoose.Schema(
  {
    locationType: {
      type: String,
      required: true,
      enum: ["Shop", "Warehouse"],
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    colour: {
      type: String,
      trim: true,
    },

    image: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    costPrice: {
      type: Number,
      required: true,
      min: [0, "Cost price cannot be negative"],
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: [0, "Selling price cannot be negative"],
    },

    totalQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    inventoryDistribution: {
      type: [LocationStockSchema],
      required:false,
      default: [],
    },
  },
  {
    collection: "products",
    timestamps: true,
  },
);

productSchema.index({ code: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

export const ProductModel = mongoose.model("Product", productSchema);
