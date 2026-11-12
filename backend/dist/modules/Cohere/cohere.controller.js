"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGenerateDescription = handleGenerateDescription;
const cohere_service_1 = require("./cohere.service");
async function handleGenerateDescription(req, res, next) {
    try {
        const result = await (0, cohere_service_1.generateProductDescription)(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=cohere.controller.js.map