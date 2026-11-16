import { Router } from "express";
import {
  setAnalyticsConsent,
  trackAnalyticsEvent,
} from "./analytics.controller";
import { requireAnalyticsConsent } from "./analytics.middleware";

export function AnalyticsRouter(): Router {
  const router = Router();

  router.post("/consent", setAnalyticsConsent);
  router.post("/events", requireAnalyticsConsent, trackAnalyticsEvent);

  return router;
}