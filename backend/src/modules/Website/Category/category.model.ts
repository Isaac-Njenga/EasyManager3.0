import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "categories",
    timestamps: true,
  },
);

categorySchema.set("autoIndex", false);

categorySchema.index({ status: 1, sortOrder: 1 });

export const CategoryModel = mongoose.model("Category", categorySchema);
