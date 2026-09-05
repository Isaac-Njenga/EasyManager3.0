import mongoose from "mongoose";
import crypto from "node:crypto";

const transferLocationSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "locationType",
    },
    locationType: {
      type: String,
      required: true,
      enum: ["Shop", "Warehouse"],
    },
  },
  { _id: false },
);

const transferSchema = new mongoose.Schema(
  {
    transferNumber: { type: String, unique: true },
    type: {
      type: String,
      required: true,
      enum: [
        "inter_warehouse",
        "store_replenishment",
        "return_to_hub",
        "inter_shop",
      ],
    },
    source: { type: transferLocationSchema, required: true },
    destination: { type: transferLocationSchema, required: true },
    items: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      ],
      required: true,
    },
    totalItemsCount: {
      type: Number,
      required: true,
      min: [1, "Count cannot be negative"],
    },
    dateOfTransfer: { type: String, required: true },
    notes: { type: String, required: false },
  },
  { collection: "transfers", timestamps: true },
);

function generateTransferNumber(): string {
  const namePrefix = "TRN";
  const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${namePrefix}-${randomSuffix}`;
}

transferSchema.pre("save", async function () {
  if (!this.transferNumber) {
    let isUnique = false;
    let candidateNumber = "";
    let attempts = 0;
    const maxAttempts = 10;

    // Retry loop to ensure uniqueness
    while (!isUnique && attempts < maxAttempts) {
      candidateNumber = generateTransferNumber();

      // Check MongoDB if candidateNumber exists
      const existingTransfer = await mongoose.models.Transfer.findOne({
        transferNumber: candidateNumber,
      });

      if (!existingTransfer) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error(
        "Failed to generate a unique receipt number after multiple attempts.",
      );
    }

    this.transferNumber = candidateNumber;
  }
});

export const TransferModel = mongoose.model("Transfer", transferSchema);
