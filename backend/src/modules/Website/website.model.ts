import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    colours: {
      type: [String],
      trim: true,
      default: [],
    },
   tags: {
      type: [String],
      trim: true,
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Cost price cannot be negative"],
    },
    discount: {
      type: Number,
      required: true,
      min: [0, "Cost price cannot be negative"],
      max: [100, "Discount cannot be more than 100%"],
    },
    isBestSeller: {
      type: Boolean,
      required: false,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      required: false,
      default: false,
      index: true,
    },
    inStock: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { collection: "website", timestamps: true },
);

export const WebsiteModel = mongoose.model("Website", websiteSchema);
