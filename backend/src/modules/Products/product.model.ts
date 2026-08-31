import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: false },
    code: { type: String, required: true,unique:true },
    colour: { type: String, required: false },
    image: { type: [String], required: false ,default:null},
    description: { type: String, required: false },
    category: { type: String, required: true },
    costPrice: { type: String, required: true },
    sellingPrice: { type: String, required: true },
    totalQuantity: { type: String, required: false },
    status: { type: String, required: true, enum: ["Active", "Inactive"],default:'Active' },
    // inventory?: LocationStock[]; // will be done later after locations have been added
  },
  { collection: "products", timestamps: true },
);

export const ProductModel = mongoose.model("Product", productSchema);
