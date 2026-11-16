"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsConsentSchema = exports.createAnalyticsEventSchema = void 0;
exports.parseAnalyticsEventInput = parseAnalyticsEventInput;
exports.parseAnalyticsConsentInput = parseAnalyticsConsentInput;
const zod_1 = require("zod");
const BadRequestError_1 = require("../../../common/errors/BadRequestError");
const analytics_types_1 = require("./analytics.types");
const identifier = zod_1.z
    .string()
    .trim()
    .min(1)
    .max(128)
    .regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/, "Invalid identifier");
const nullableText = (max) => zod_1.z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !/[\u0000-\u001f\u007f]/.test(value))
    .nullable()
    .optional();
const metadataValue = zod_1.z.union([zod_1.z.boolean(), zod_1.z.number().finite()]);
const metadataSchema = zod_1.z
    .record(zod_1.z
    .string()
    .regex(/^[A-Za-z][A-Za-z0-9_]{0,39}$/)
    .refine((key) => !["__proto__", "constructor", "prototype"].includes(key)), metadataValue)
    .refine((metadata) => Object.keys(metadata).length <= 20);
exports.createAnalyticsEventSchema = zod_1.z.strictObject({
    eventId: identifier,
    eventName: zod_1.z.enum(analytics_types_1.ANALYTICS_EVENT_NAMES),
    visitorId: identifier,
    sessionId: identifier,
    pagePath: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(2048)
        .regex(/^\/(?!\/)[^\s?#]*$/, "Page path must be a relative path"),
    referrer: zod_1.z
        .string()
        .trim()
        .max(2048)
        .url()
        .refine((value) => /^https?:\/\//i.test(value), "Invalid referrer")
        .transform((value) => new URL(value).origin)
        .nullable()
        .optional(),
    entityType: zod_1.z
        .enum(["CATALOG", "CATEGORY", "BANNER", "PAGE", "NONE"])
        .nullable()
        .optional(),
    entityId: identifier.nullable().optional(),
    searchQuery: nullableText(200),
    searchResultsCount: zod_1.z
        .number()
        .int()
        .min(0)
        .max(1000000)
        .nullable()
        .optional(),
    placement: nullableText(100),
    position: zod_1.z.number().int().min(0).max(100000).nullable().optional(),
    interactionChannel: zod_1.z
        .enum(["WHATSAPP", "PHONE", "WEBSITE", "OTHER"])
        .nullable()
        .optional(),
    metadata: metadataSchema.optional(),
    occurredAt: zod_1.z
        .iso
        .datetime({ offset: true })
        .transform((value) => new Date(value))
        .refine((value) => value.getTime() <= Date.now() + 5 * 60 * 1000, "Event timestamp cannot be more than five minutes in the future"),
});
exports.analyticsConsentSchema = zod_1.z.strictObject({
    granted: zod_1.z.boolean(),
});
function parseAnalyticsEventInput(input) {
    const result = exports.createAnalyticsEventSchema.safeParse(input);
    if (!result.success) {
        throw new BadRequestError_1.BadRequestError(result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; "));
    }
    return result.data;
}
function parseAnalyticsConsentInput(input) {
    const result = exports.analyticsConsentSchema.safeParse(input);
    if (!result.success) {
        throw new BadRequestError_1.BadRequestError(result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; "));
    }
    return result.data;
}
//# sourceMappingURL=analytics.validation.js.map