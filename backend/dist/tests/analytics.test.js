"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_events_1 = require("node:events");
const express_1 = __importDefault(require("express"));
const node_test_1 = require("node:test");
const analytics_model_1 = require("../modules/Website/Analytics/analytics.model");
const analytics_routes_1 = require("../modules/Website/Analytics/analytics.routes");
(0, node_test_1.test)("analytics API requires signed consent, validates events, and deduplicates event IDs", async (t) => {
    const originalJwtSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "analytics-test-secret";
    const savedEventIds = new Set();
    const savedReferrers = [];
    const originalSave = analytics_model_1.AnalyticsEventModel.prototype.save;
    analytics_model_1.AnalyticsEventModel.prototype.save = async function () {
        const eventId = this.eventId;
        if (savedEventIds.has(eventId)) {
            throw Object.assign(new Error("Duplicate event ID"), { code: 11000 });
        }
        savedEventIds.add(eventId);
        savedReferrers.push(this.referrer);
        return this;
    };
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/analytics", (0, analytics_routes_1.AnalyticsRouter)());
    app.use((error, _req, res, _next) => {
        res.status(error.statusCode ?? 500).json({ message: error.message });
    });
    const server = app.listen(0);
    await (0, node_events_1.once)(server, "listening");
    t.after(async () => {
        analytics_model_1.AnalyticsEventModel.prototype.save = originalSave;
        if (originalJwtSecret === undefined) {
            delete process.env.JWT_SECRET;
        }
        else {
            process.env.JWT_SECRET = originalJwtSecret;
        }
        server.closeAllConnections();
        await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    });
    const address = server.address();
    strict_1.default.ok(address && typeof address !== "string");
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
    strict_1.default.equal(withoutConsent.status, 403);
    const consentResponse = await fetch(`${baseUrl}/consent`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ granted: true }),
    });
    strict_1.default.equal(consentResponse.status, 200);
    const setCookie = consentResponse.headers.get("set-cookie");
    strict_1.default.ok(setCookie?.includes("HttpOnly"));
    const consentCookie = setCookie?.split(";")[0];
    strict_1.default.ok(consentCookie);
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
        strict_1.default.equal(invalid.status, 400);
    }
    const accepted = await fetch(`${baseUrl}/events`, {
        method: "POST",
        headers,
        body: JSON.stringify(validEvent),
    });
    strict_1.default.equal(accepted.status, 201);
    const acceptedBody = (await accepted.json());
    strict_1.default.deepEqual(acceptedBody.data, {
        eventId: "event-001",
        duplicate: false,
    });
    strict_1.default.deepEqual(savedReferrers, ["https://store.example"]);
    const duplicate = await fetch(`${baseUrl}/events`, {
        method: "POST",
        headers,
        body: JSON.stringify(validEvent),
    });
    strict_1.default.equal(duplicate.status, 200);
    const duplicateBody = (await duplicate.json());
    strict_1.default.deepEqual(duplicateBody.data, {
        eventId: "event-001",
        duplicate: true,
    });
    const withdrawal = await fetch(`${baseUrl}/consent`, {
        method: "POST",
        headers: { "content-type": "application/json", cookie: consentCookie },
        body: JSON.stringify({ granted: false }),
    });
    strict_1.default.equal(withdrawal.status, 200);
    strict_1.default.match(withdrawal.headers.get("set-cookie") ?? "", /Expires=Thu, 01 Jan 1970/i);
    const afterWithdrawal = await fetch(`${baseUrl}/events`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...validEvent, eventId: "event-002" }),
    });
    strict_1.default.equal(afterWithdrawal.status, 403);
});
//# sourceMappingURL=analytics.test.js.map