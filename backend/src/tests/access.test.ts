import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  assertAuditReadOnly,
  assertNotAuditAccount,
  canAccessAdminRoute,
} from "../middleware/access-policy";
import { UserModel } from "../modules/Users/user.model";
import { OtpModel } from "../modules/OTP/otp.model";
import jwt from "jsonwebtoken";
const originalFindById = UserModel.findById;
const originalFindOne = UserModel.findOne;
const originalOtpFind = OtpModel.findOne;
afterEach(() => {
  UserModel.findById = originalFindById;
  UserModel.findOne = originalFindOne;
  OtpModel.findOne = originalOtpFind;
});
function invoke(middleware: any, req: any): Promise<void> {
  return new Promise((resolve, reject) =>
    middleware(req, {}, (error?: Error) => (error ? reject(error) : resolve())),
  );
}
async function configuration() {
  for (const key of [
    "URI",
    "JWT_SECRET",
    "EMAIL_HOST",
    "EMAIL_USER",
    "EMAIL_PASS",
    "REDIS_URL",
    "FRONTEND_URL",
    "WEBSITE_URL",
    "DEPLOYED_WEBSITE_URL",
    "GEMINI_API_KEY",
    "PROJECT_NUMBER",
    "PROJECT_NAME",
    "NAME",
    "COHERE_API_KEY",
  ])
    process.env[key] ??= "access-test-placeholder";
  return (await import("../config/env")).env;
}
test("audit can read admin resources, but cannot use any write method", () => {
  for (const method of ["GET", "HEAD", "OPTIONS"]) {
    assert.doesNotThrow(() => assertAuditReadOnly("AUDIT", method));
    assert.equal(canAccessAdminRoute("AUDIT", method), true);
  }
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "TRACE", "CONNECT"]) {
    assert.throws(() => assertAuditReadOnly("AUDIT", method), {
      statusCode: 403,
    });
    assert.equal(canAccessAdminRoute("AUDIT", method), false);
  }
  assert.equal(canAccessAdminRoute("SUPER_ADMIN", "POST"), true);
  assert.equal(canAccessAdminRoute("SALESPERSON", "GET"), false);
  assert.throws(() => assertNotAuditAccount("AUDIT"), { statusCode: 403 });
});
test("global guard rejects audit writes across every module, using the database role", async () => {
  const env = await configuration();
  const { restrictAuditWrites } = await import("../middleware/auth.middleware");
  const token = jwt.sign(
    { userId: "3001", role: "SUPER_ADMIN" },
    env.JWT_SECRET,
  );
  UserModel.findById = (() => ({
    select: async () => ({ role: "AUDIT", isActivated: true }),
  })) as any;
  for (const path of [
    "/sale/create-sale",
    "/user/update-user/3001",
    "/shop/add-products/1",
    "/transfer/create-transfer",
    "/catalog/create-catalog-product",
    "/cohere-model/generate-description",
    "/gemini-model/generate-description",
    "/auth/sign-up",
    "/auth/change-password",
    "/auth/password-reset/reset",
    "/future-module/action",
  ]) {
    await assert.rejects(
      invoke(restrictAuditWrites, {
        method: "POST",
        path,
        header: () => `Bearer ${token}`,
      }),
      { statusCode: 403 },
    );
  }
  await invoke(restrictAuditWrites, {
    method: "POST",
    path: "/auth/sign-in",
    header: () => undefined,
  });
});
test("protected reads and admin reads allow audit, while direct protected mutations fail", async () => {
  await configuration();
  const { protectRoute } = await import("../middleware/auth.middleware");
  const { adminRoute } = await import("../middleware/admin.middleware");
  for (const method of ["GET", "HEAD", "OPTIONS"]) {
    await invoke(protectRoute, { method, user: { role: "AUDIT" } });
    await invoke(adminRoute, { method, user: { role: "AUDIT" } });
  }
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
    await assert.rejects(
      invoke(protectRoute, { method, user: { role: "AUDIT" } }),
      { statusCode: 403 },
    );
    await assert.rejects(
      invoke(adminRoute, { method, user: { role: "AUDIT" } }),
      { statusCode: 403 },
    );
  }
  await invoke(protectRoute, { method: "POST", user: { role: "SALESPERSON" } });
  await invoke(adminRoute, { method: "POST", user: { role: "SUPER_ADMIN" } });
});
test("disabled audit accounts and missing authentication cannot read protected resources", async () => {
  const env = await configuration();
  const { protectRoute } = await import("../middleware/auth.middleware");
  UserModel.findById = (() => ({
    select: async () => ({ role: "AUDIT", isActivated: false }),
  })) as any;
  const token = jwt.sign({ userId: "3001" }, env.JWT_SECRET);
  await assert.rejects(
    invoke(protectRoute, { method: "GET", header: () => `Bearer ${token}` }),
  );
  await assert.rejects(
    invoke(protectRoute, { method: "GET", header: () => undefined }),
  );
});
test("password changes and recovery cannot mutate audit accounts even without a bearer token", async () => {
  await configuration();
  const { changePassword, requestPasswordResetOtp, resetPassword } =
    await import("../modules/Auth/auth.service");
  const audit = {
    role: "AUDIT",
    password: "hashed",
    save: () => {
      throw new Error("Unexpected save");
    },
  };
  const query: any = Promise.resolve(audit);
  query.select = async () => audit;
  UserModel.findOne = (() => query) as any;
  OtpModel.findOne = (async () => ({ email: "audit@example.invalid" })) as any;
  await assert.rejects(
    changePassword({
      userId: "3001",
      email: "audit@example.invalid",
      oldPassword: "old-password",
      newPassword: "new-password",
    }),
    { statusCode: 403 },
  );
  await assert.rejects(
    requestPasswordResetOtp({ userId: "3001", email: "audit@example.invalid" }),
    { statusCode: 403 },
  );
  await assert.rejects(
    resetPassword({
      userId: "3001",
      email: "audit@example.invalid",
      newPassword: "new-password",
    }),
    { statusCode: 403 },
  );
});
test("audit user model validates as an activated account", async () => {
  await new UserModel({
    userId: "3001",
    password: "hashed",
    role: "AUDIT",
    isActivated: true,
  }).validate();
});
