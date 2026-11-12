import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema(
  {
    // 1. Basic information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // shortDescription: {
    //   type: String,
    //   default: "",
    //   trim: true,
    //   maxlength: 300,
    // },

    // 2. Classification
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    // 3. Media
    images: {
      type: [String],
      default: [],
    },

    colours: {
      type: [String],
      default: [],
    },

    keyFeatures: {
      type: [String],
      default: [],
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    // 4. Website pricing (KES)
    pricing: {
      currency: {
        type: String,
        default: "KES",
      },

      basePrice: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
      },

      compareAtPrice: {
        type: Number,
        min: [0, "Compare-at price cannot be negative"],
        default: null,
      },
    },

    // 5. Merchandising
    merchandising: {
      isFeatured: {
        type: Boolean,
        default: false,
      },

      isBestSeller: {
        type: Boolean,
        default: false,
      },

      isNewArrival: {
        type: Boolean,
        default: false,
      },

      sortOrder: {
        type: Number,
        default: 0,
      },
    },

    // 6. Publishing
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },

    // 7. SEO
    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: 70,
      },

      metaDescription: {
        type: String,
        trim: true,
        maxlength: 320,
      },
    },
  },
  {
    collection: "catalog",
    timestamps: true,
  },
);

// Indexes
catalogSchema.index({ slug: 1 }, { unique: true });

// when retrieving catalogue items, use .populate('category') to get the category details
catalogSchema.index({ category: 1, status: 1 });

catalogSchema.index({
  "merchandising.isFeatured": 1,
  status: 1,
});

catalogSchema.index({
  "merchandising.isBestSeller": 1,
  status: 1,
});

catalogSchema.index({
  "merchandising.isNewArrival": 1,
  status: 1,
});

catalogSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

catalogSchema.set("autoIndex", false);

export const CatalogModel = mongoose.model("Catalog", catalogSchema);
