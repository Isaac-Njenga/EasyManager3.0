"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProductDescription = generateProductDescription;
const genai_1 = require("@google/genai");
const env_1 = require("../../config/env");
const ai = new genai_1.GoogleGenAI({ apiKey: env_1.env.GEMINI_API_KEY });
async function generateProductDescription(input) {
    const { name, category, colours = [], price } = input;
    const prompt = `Generate a compelling, high-converting product description for an e-commerce listing:
- Product Name: ${name}
- Category: ${category}
- Colors Available: ${colours.length > 0 ? colours.join(", ") : "Standard"}
- Selling Price: KES ${price}`;
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            // Low temperature ensures faster and more deterministic responses
            temperature: 0.3,
            systemInstruction: `You are an expert e-commerce copywriter for EasyDeal Furniture.
Your goal is to write concise, professional, and appealing product descriptions tailored to modern online shoppers.
Focus on material quality, aesthetic appeal, and functionality without fluff.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: genai_1.Type.OBJECT,
                properties: {
                    description: {
                        type: genai_1.Type.STRING,
                        description: "A 2 to 3 sentence product description paragraph.",
                    },
                    keyFeatures: {
                        type: genai_1.Type.ARRAY,
                        items: { type: genai_1.Type.STRING },
                        description: "3 bullet points summarizing main features or materials.",
                    },
                },
                required: ["description", "keyFeatures"],
            },
        },
    });
    if (!response.text) {
        throw new Error("Failed to generate product description from Gemini API");
    }
    return JSON.parse(response.text);
}
//# sourceMappingURL=gemini.service.js.map