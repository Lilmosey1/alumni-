import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProductInsights = async (product: Product): Promise<string> => {
  try {
    const prompt = `
      You are an expert appraiser for an online marketplace called "Alumni".
      Analyze this item: "${product.title}" listed for ${product.price} ${product.currency} in ${product.location.city}, ${product.location.country}.
      Condition: ${product.condition}.
      Description: ${product.description}.

      Please provide a brief, professional assessment (max 100 words) covering:
      1. Whether this price seems fair for the current market.
      2. What a buyer should check for in photos regarding this specific type of item.
      3. A fun historical or cultural fact about this type of item.

      Tone: Helpful, knowledgeable, and trustworthy.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Insight currently unavailable. Please check back later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our AI appraiser is currently taking a break. Please try again later.";
  }
};
