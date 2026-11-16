import { createHmac, timingSafeEqual } from "node:crypto";
import type { CookieOptions } from "express";

export const ANALYTICS_CONSENT_COOKIE = "analytics_consent";
const CONSENT_TTL_SECONDS = 60 * 60 * 24 * 180;
const CONSENT_TTL_MS = CONSENT_TTL_SECONDS * 1000;

function consentSigningKey(): Buffer {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required to sign analytics consent");
  }
  return createHmac("sha256", secret)
    .update("easy-manager:analytics-consent:v1")
    .digest();
}

export function createAnalyticsConsentToken(now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({
      consent: "granted",
      expiresAt: now + CONSENT_TTL_MS,
    }),
  ).toString("base64url");
  const signature = createHmac("sha256", consentSigningKey())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function hasValidAnalyticsConsent(
  cookieHeader: string | undefined,
  now = Date.now(),
): boolean {
  if (!cookieHeader) return false;

  const cookiePrefix = `${ANALYTICS_CONSENT_COOKIE}=`;
  const values = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.startsWith(cookiePrefix))
    .map((part) => part.slice(cookiePrefix.length));
  if (values.length !== 1) return false;

  const [payload, signature, extra] = values[0].split(".");
  if (!payload || !signature || extra !== undefined) return false;

  const expectedSignature = createHmac("sha256", consentSigningKey())
    .update(payload)
    .digest();
  const actualSignature = Buffer.from(signature, "base64url");
  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return false;
  }

  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("consent" in parsed) ||
      parsed.consent !== "granted" ||
      !("expiresAt" in parsed) ||
      typeof parsed.expiresAt !== "number"
    ) {
      return false;
    }
    return parsed.expiresAt > now;
  } catch {
    return false;
  }
}

export function analyticsConsentCookieOptions(): CookieOptions {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    maxAge: CONSENT_TTL_MS,
  };
}

export function analyticsConsentClearCookieOptions(): CookieOptions {
  const { maxAge: _maxAge, ...options } = analyticsConsentCookieOptions();
  return options;
}
