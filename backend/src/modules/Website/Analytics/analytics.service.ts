import mongoose from "mongoose";
import { BadRequestError } from "../../../common/errors/BadRequestError";
import { AnalyticsEventModel } from "./analytics.model";
import { AnalyticsEventResult } from "./analytics.types";
import { parseAnalyticsEventInput } from "./analytics.validation";

export async function recordAnalyticsEvent(
  input: unknown,
): Promise<AnalyticsEventResult> {
  const event = parseAnalyticsEventInput(input);
  const document = new AnalyticsEventModel(event);

  try {
    await document.save();
    return { eventId: event.eventId, duplicate: false };
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return { eventId: event.eventId, duplicate: true };
    }
    if (error instanceof mongoose.Error.ValidationError) {
      throw new BadRequestError(error.message);
    }
    throw error;
  }
}