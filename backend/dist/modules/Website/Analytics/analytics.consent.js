"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANALYTICS_CONSENT_COOKIE = void 0;
exports.createAnalyticsConsentToken = createAnalyticsConsentToken;
exports.hasValidAnalyticsConsent = hasValidAnalyticsConsent;
exports.analyticsConsentCookieOptions = analyticsConsentCookieOptions;
exports.analyticsConsentClearCookieOptions = analyticsConsentClearCookieOptions;
const node_crypto_1 = require("node:crypto");
exports.ANALYTICS_CONSENT_COOKIE = "analytics_consent";
const CONSENT_TTL_SECONDS = 60 * 60 * 24 * 180;
const CONSENT_TTL_MS = CONSENT_TTL_SECONDS * 1000;
function consentSigningKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is required to sign analytics consent");
    }
    return (0, node_crypto_1.createHmac)("sha256", secret)
        .update("easy-manager:analytics-consent:v1")
        .digest();
}
function createAnalyticsConsentToken(now = Date.now()) {
    const payload = Buffer.from(JSON.stringify({
        consent: "granted",
        expiresAt: now + CONSENT_TTL_MS,
    })).toString("base64url");
    const signature = (0, node_crypto_1.createHmac)("sha256", consentSigningKey())
        .update(payload)
        .digest("base64url");
    return `${payload}.${signature}`;
}
function hasValidAnalyticsConsent(cookieHeader, now = Date.now()) {
    if (!cookieHeader)
        return false;
    const cookiePrefix = `${exports.ANALYTICS_CONSENT_COOKIE}=`;
    const values = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .filter((part) => part.startsWith(cookiePrefix))
        .map((part) => part.slice(cookiePrefix.length));
    if (values.length !== 1)
        return false;
    const [payload, signature, extra] = values[0].split(".");
    if (!payload || !signature || extra !== undefined)
        return false;
    const expectedSignature = (0, node_crypto_1.createHmac)("sha256", consentSigningKey())
        .update(payload)
        .digest();
    const actualSignature = Buffer.from(signature, "base64url");
    if (actualSignature.length !== expectedSignature.length ||
        !(0, node_crypto_1.timingSafeEqual)(actualSignature, expectedSignature)) {
        return false;
    }
    try {
        const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (typeof parsed !== "object" ||
            parsed === null ||
            !("consent" in parsed) ||
            parsed.consent !== "granted" ||
            !("expiresAt" in parsed) ||
            typeof parsed.expiresAt !== "number") {
            return false;
        }
        return parsed.expiresAt > now;
    }
    catch {
        return false;
    }
}
function analyticsConsentCookieOptions() {
    const secure = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        path: "/",
        maxAge: CONSENT_TTL_MS,
    };
}
function analyticsConsentClearCookieOptions() {
    const { maxAge: _maxAge, ...options } = analyticsConsentCookieOptions();
    return options;
}
//# sourceMappingURL=analytics.consent.js.map