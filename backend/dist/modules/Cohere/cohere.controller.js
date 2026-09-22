"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGenerateDescription = handleGenerateDescription;
const cohere_service_1 = require("./cohere.service");
async function handleGenerateDescription(req, res, next) {
    try {
        const { name, category, colours, price } = req.body;
        if (!name || !category || price === undefined) {
            res.status(400).json({
                error: "Missing required fields: name, category, and price are required.",
            });
            return;
        }
        const result = await (0, cohere_service_1.generateProductDescription)({
            name,
            category,
            colours,
            price: Number(price),
        });
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