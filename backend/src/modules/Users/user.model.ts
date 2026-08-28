import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, trim: true, default: "" },
    lastname: { type: String, trim: true, default: "" },

    userId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    avatar: { type: String, default: null },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "SALESPERSON"],
      required: true,
      default: "SALESPERSON",
    },

    isActivated: { type: Boolean, default: false },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

UserSchema.index({ role: 1 });
UserSchema.index({ isActivated: 1 });

export const UserModel = mongoose.model("User", UserSchema);
