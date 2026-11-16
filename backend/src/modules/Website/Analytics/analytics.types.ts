export const ANALYTICS_EVENT_NAMES = [
  "page_view",
  "product_impression",
  "product_click",
  "product_view",
  "banner_impression",
  "banner_click",
  "category_click",
  "search",
  "quote_start",
  "quote_submit",
  "quote_whatsapp_click",
  "quote_phone_click",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];
export type AnalyticsEntityType =
  | "CATALOG"
  | "CATEGORY"
  | "BANNER"
  | "PAGE"
  | "NONE";
export type AnalyticsInteractionChannel =
  | "WHATSAPP"
  | "PHONE"
  | "WEBSITE"
  | "OTHER";

export interface CreateAnalyticsEventDTO {
  eventId: string;
  eventName: AnalyticsEventName;
  visitorId: string;
  sessionId: string;
  pagePath: string;
  referrer?: string | null;
  entityType?: AnalyticsEntityType | null;
  entityId?: string | null;
  searchQuery?: string | null;
  searchResultsCount?: number | null;
  placement?: string | null;
  position?: number | null;
  interactionChannel?: AnalyticsInteractionChannel | null;
  metadata?: Record<string, boolean | number>;
  occurredAt: string;
}

export interface AnalyticsEventResult {
  eventId: string;
  duplicate: boolean;
}

export interface AnalyticsConsentRequest {
  granted: boolean;
}