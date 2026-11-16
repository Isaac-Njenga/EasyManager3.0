import { Request, Response } from "express";
import { catchAsync } from "../../../common/utils/catchAsync";
import {
  ANALYTICS_CONSENT_COOKIE,
  analyticsConsentClearCookieOptions,
  analyticsConsentCookieOptions,
  createAnalyticsConsentToken,
} from "./analytics.consent";
import { recordAnalyticsEvent } from "./analytics.service";
import { parseAnalyticsConsentInput } from "./analytics.validation";

export const setAnalyticsConsent = catchAsync(
  async (req: Request, res: Response) => {
    const { granted } = parseAnalyticsConsentInput(req.body);

    if (granted) {
      res.cookie(
        ANALYTICS_CONSENT_COOKIE,
        createAnalyticsConsentToken(),
        analyticsConsentCookieOptions(),
      );
    } else {
      res.clearCookie(
        ANALYTICS_CONSENT_COOKIE,
        analyticsConsentClearCookieOptions(),
      );
    }

    res.status(200).json({
      success: true,
      data: { granted },
      message: granted
        ? "Analytics consent recorded"
        : "Analytics consent withdrawn",
    });
  },
);

export const trackAnalyticsEvent = catchAsync(
  async (req: Request, res: Response) => {
    const result = await recordAnalyticsEvent(req.body);
    res.status(result.duplicate ? 200 : 201).json({
      success: true,
      data: result,
      message: result.duplicate
        ? "Analytics event was already recorded"
        : "Analytics event recorded",
    });
  },
);