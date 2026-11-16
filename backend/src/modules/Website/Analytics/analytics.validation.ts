import { z } from "zod";
import { BadRequestError } from "../../../common/errors/BadRequestError";
import { ANALYTICS_EVENT_NAMES } from "./analytics.types";

const identifier = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/, "Invalid identifier");

const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !/[\u0000-\u001f\u007f]/.test(value))
    .nullable()
    .optional();

const metadataValue = z.union([z.boolean(), z.number().finite()]);
const metadataSchema = z
  .record(
    z
      .string()
      .regex(/^[A-Za-z][A-Za-z0-9_]{0,39}$/)
      .refine(
        (key) => !["__proto__", "constructor", "prototype"].includes(key),
      ),
    metadataValue,
  )
  .refine((metadata) => Object.keys(metadata).length <= 20);

export const createAnalyticsEventSchema = z.strictObject({
  eventId: identifier,
  eventName: z.enum(ANALYTICS_EVENT_NAMES),
  visitorId: identifier,
  sessionId: identifier,
  pagePath: z
    .string()
    .trim()
    .min(1)
    .max(2048)
    .regex(/^\/(?!\/)[^\s?#]*$/, "Page path must be a relative path"),
  referrer: z
    .string()
    .trim()
    .max(2048)
    .url()
    .refine((value) => /^https?:\/\//i.test(value), "Invalid referrer")
    .transform((value) => new URL(value).origin)
    .nullable()
    .optional(),
  entityType: z
    .enum(["CATALOG", "CATEGORY", "BANNER", "PAGE", "NONE"])
    .nullable()
    .optional(),
  entityId: identifier.nullable().optional(),
  searchQuery: nullableText(200),
  searchResultsCount: z
    .number()
    .int()
    .min(0)
    .max(1_000_000)
    .nullable()
    .optional(),
  placement: nullableText(100),
  position: z.number().int().min(0).max(100_000).nullable().optional(),
  interactionChannel: z
    .enum(["WHATSAPP", "PHONE", "WEBSITE", "OTHER"])
    .nullable()
    .optional(),
  metadata: metadataSchema.optional(),
  occurredAt: z
    .iso
    .datetime({ offset: true })
    .transform((value) => new Date(value))
    .refine(
      (value) => value.getTime() <= Date.now() + 5 * 60 * 1000,
      "Event timestamp cannot be more than five minutes in the future",
    ),
});

export const analyticsConsentSchema = z.strictObject({
  granted: z.boolean(),
});

export function parseAnalyticsEventInput(input: unknown) {
  const result = createAnalyticsEventSchema.safeParse(input);
  if (!result.success) {
    throw new BadRequestError(
      result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
    );
  }
  return result.data;
}

export function parseAnalyticsConsentInput(
  input: unknown,
): z.infer<typeof analyticsConsentSchema> {
  const result = analyticsConsentSchema.safeParse(input);
  if (!result.success) {
    throw new BadRequestError(
      result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
    );
  }
  return result.data;
}
