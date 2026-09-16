import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../../config/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export interface GenerateDescriptionInput {
  name: string;
  category: string;
  colours?: string[];
  price: number;
}

export interface GeneratedDescriptionResponse {
  description: string;
  keyFeatures: string[];
  tags: string[];
}

export async function generateProductDescription(
  input: GenerateDescriptionInput,
): Promise<GeneratedDescriptionResponse> {
  const { name, category, colours = [], price } = input;

  const prompt = `Generate a compelling, high-converting product description and relevant search tags for an e-commerce listing:
- Product Name: ${name}
- Category: ${category}
- Colors Available: ${colours.length > 0 ? colours.join(", ") : "Standard"}
- Selling Price: KES ${price}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      temperature: 0.3,
      systemInstruction: `You are an expert e-commerce copywriter for EasyDeal Furniture.
Your goal is to write concise, professional, and appealing product descriptions tailored to modern online shoppers, as well as relevant tags.
Focus on material quality, aesthetic appeal, and functionality without fluff.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: {
            type: Type.STRING,
            description: "A 2 to 3 sentence product description paragraph.",
          },
          keyFeatures: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 bullet points summarizing main features or materials.",
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 to 5 relevant search tags (e.g., Ergonomic, Modern Wood, Waterproof).",
          },
        },
        required: ["description", "keyFeatures", "tags"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate product description from Gemini API");
  }

  return JSON.parse(response.text) as GeneratedDescriptionResponse;
}