"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const transferLocationSchema = new mongoose_1.default.Schema({
    locationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: "locationType",
    },
    locationType: {
        type: String,
        required: true,
        enum: ["Shop", "Warehouse"],
    },
}, { _id: false });
const transferSchema = new mongoose_1.default.Schema({
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
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Product",
        required: true,
    },
    totalItemsCount: {
        type: Number,
        required: true,
        min: [1, "Count cannot be negative"],
    },
    dateOfTransfer: { type: String, required: true },
    notes: { type: String, required: false },
}, { collection: "transfers", timestamps: true });
function generateTransferNumber() {
    const namePrefix = "TRN";
    const randomSuffix = node_crypto_1.default.randomBytes(2).toString("hex").toUpperCase();
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
            const existingTransfer = await mongoose_1.default.models.Transfer.findOne({
                transferNumber: candidateNumber,
            });
            if (!existingTransfer) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) {
            throw new Error("Failed to generate a unique receipt number after multiple attempts.");
        }
        this.transferNumber = candidateNumber;
    }
});
exports.TransferModel = mongoose_1.default.model("Transfer", transferSchema);
//# sourceMappingURL=transfer.model.js.map