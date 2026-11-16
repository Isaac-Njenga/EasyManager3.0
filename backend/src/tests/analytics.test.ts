import assert from "node:assert/strict";
import { once } from "node:events";
import express from "express";
import { test } from "node:test";
import { AnalyticsEventModel } from "../modules/Website/Analytics/analytics.model";
import { AnalyticsRouter } from "../modules/Website/Analytics/analytics.routes";

test("analytics API requires signed consent, validates events, and deduplicates event IDs", async (t) => {
  const originalJwtSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "analytics-test-secret";
  const savedEventIds = new Set<string>();
  const savedReferrers: (string | undefined)[] = [];
  const originalSave = AnalyticsEventModel.prototype.save;
  AnalyticsEventModel.prototype.save = async function (this: any) {
    const eventId = this.eventId as string;
    if (savedEventIds.has(eventId)) {
      throw Object.assign(new Error("Duplicate event ID"), { code: 11000 });
    }
    savedEventIds.add(eventId);
    savedReferrers.push(this.referrer);
    return this;
  } as typeof AnalyticsEventModel.prototype.save;

  const app = express();
  app.use(express.json());
  app.use("/api/analytics", AnalyticsRouter());
  app.use(
    (
      error: { statusCode?: number; message?: string },
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      res.status(error.statusCode ?? 500).json({ message: error.message });
    },
  );
  const server = app.listen(0);
  await once(server, "listening");
  t.after(async () => {
    AnalyticsEventModel.prototype.save = originalSave;
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });

  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const baseUrl = `http://127.0.0.1:${address.port}/api/analytics`;
  const validEvent = {
    eventId: "event-001",
    eventName: "page_view",
    visitorId: "visitor-001",
    sessionId: "session-001",
    pagePath: "/products",
    referrer: "https://store.example/products?private=value",
    occurredAt: new Date().toISOString(),
  };

  const withoutConsent = await fetch(`${baseUrl}/events`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validEvent),
  });
  assert.equal(withoutConsent.status, 403);

  const consentResponse = await fetch(`${baseUrl}/consent`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ granted: true }),
  });
  assert.equal(consentResponse.status, 200);
  const setCookie = consentResponse.headers.get("set-cookie");
  assert.ok(setCookie?.includes("HttpOnly"));
  const consentCookie = setCookie?.split(";")[0];
  assert.ok(consentCookie);
  const headers = {
    "content-type": "application/json",
    cookie: consentCookie,
  };

  for (const invalidEvent of [
    { ...validEvent, eventName: "unknown_event" },
    { ...validEvent, visitorId: "visitor id" },
    { ...validEvent, entityId: "invalid entity id" },
    { ...validEvent, occurredAt: "not-a-timestamp" },
    { ...validEvent, position: -1 },
    { ...validEvent, message: "quotation contents must not be stored" },
  ]) {
    const invalid = await fetch(`${baseUrl}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(invalidEvent),
    });
    assert.equal(invalid.status, 400);
  }

  const accepted = await fetch(`${baseUrl}/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(validEvent),
  });
  assert.equal(accepted.status, 201);
  const acceptedBody = (await accepted.json()) as {
    data: { eventId: string; duplicate: boolean };
  };
  assert.deepEqual(acceptedBody.data, {
    eventId: "event-001",
    duplicate: false,
  });
  assert.deepEqual(savedReferrers, ["https://store.example"]);

  const duplicate = await fetch(`${baseUrl}/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(validEvent),
  });
  assert.equal(duplicate.status, 200);
  const duplicateBody = (await duplicate.json()) as {
    data: { eventId: string; duplicate: boolean };
  };
  assert.deepEqual(duplicateBody.data, {
    eventId: "event-001",
    duplicate: true,
  });

  const withdrawal = await fetch(`${baseUrl}/consent`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: consentCookie },
    body: JSON.stringify({ granted: false }),
  });
  assert.equal(withdrawal.status, 200);
  assert.match(
    withdrawal.headers.get("set-cookie") ?? "",
    /Expires=Thu, 01 Jan 1970/i,
  );

  const afterWithdrawal = await fetch(`${baseUrl}/events`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...validEvent, eventId: "event-002" }),
  });
  assert.equal(afterWithdrawal.status, 403);
});
