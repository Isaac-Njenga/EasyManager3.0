import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "../modules/Users/user.model";
async function main() {
  if (!process.env.URI) throw new Error("URI is required");
  await mongoose.connect(process.env.URI, {
    autoIndex: false,
    autoCreate: false,
    serverSelectionTimeoutMS: 10000,
  });
  try {
    const existing = await UserModel.findOne({ userId: "3001" });
    if (existing && existing.role !== "AUDIT")
      throw new Error(
        "User ID 3001 is already assigned to another role; no account was changed.",
      );
    const password = await bcrypt.hash("Audit3001", 10);
    const user = await UserModel.findOneAndUpdate(
      { userId: "3001", role: "AUDIT" },
      {
        $set: {
          password,
          role: "AUDIT",
          isActivated: true,
          refreshToken: null,
        },
        $setOnInsert: {
          userId: "3001",
          firstname: "Audit",
          lastname: "User",
          avatar: null,
        },
      },
      { upsert: true, new: true, runValidators: true },
    );
    console.log(
      JSON.stringify({
        userId: user.userId,
        role: user.role,
        isActivated: user.isActivated,
      }),
    );
  } finally {
    await mongoose.disconnect();
  }
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Audit seed failed");
  process.exitCode = 1;
});
