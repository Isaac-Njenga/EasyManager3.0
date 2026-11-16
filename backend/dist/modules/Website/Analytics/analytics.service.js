"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordAnalyticsEvent = recordAnalyticsEvent;
const mongoose_1 = __importDefault(require("mongoose"));
const BadRequestError_1 = require("../../../common/errors/BadRequestError");
const analytics_model_1 = require("./analytics.model");
const analytics_validation_1 = require("./analytics.validation");
async function recordAnalyticsEvent(input) {
    const event = (0, analytics_validation_1.parseAnalyticsEventInput)(input);
    const document = new analytics_model_1.AnalyticsEventModel(event);
    try {
        await document.save();
        return { eventId: event.eventId, duplicate: false };
    }
    catch (error) {
        if (error.code === 11000) {
            return { eventId: event.eventId, duplicate: true };
        }
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw new BadRequestError_1.BadRequestError(error.message);
        }
        throw error;
    }
}
//# sourceMappingURL=analytics.service.js.map