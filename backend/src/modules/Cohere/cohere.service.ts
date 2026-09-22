import { CohereClient } from "cohere-ai";
import { env } from "../../config/env";

const cohere = new CohereClient({ token: env.COHERE_API_KEY });

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

  const userMessage = `You are an expert e-commerce copywriter for a furniture shop.
Write concise, professional, and appealing product details tailored to modern online shoppers. Focus on material quality, aesthetic appeal, and functionality without fluff and going into too much promising detail.

Generate details for:
- Product Name: ${name}
- Category: ${category}
- Colors Available: ${colours.length > 0 ? colours.join(", ") : "Standard"}
- Selling Price: KES ${price}

Return ONLY a valid JSON object matching this schema, with no markdown formatting or extra text:
{
  "description": "string" (at least 90-120 words),
  "keyFeatures": ["string"] (at least 5),
  "tags": ["string"] (searchable tags that can be associated with similar products)
}`;

  try {
    const response = await cohere.chat({
      model: "command-r7b-12-2024",
      message: userMessage,
      temperature: 0.5,
      responseFormat: { type: "json_object" },
    });

    const responseText = response.text.trim();
    const parsedData: GeneratedDescriptionResponse = JSON.parse(responseText);

    return parsedData;
  } catch (err: any) {
    console.error("Cohere Generation Error:", err);
    throw new Error(
      `Failed to generate product description from Cohere: ${err?.message || err}`,
    );
  }
}
