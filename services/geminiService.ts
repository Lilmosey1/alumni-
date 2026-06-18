import { Product } from "../types";

export const getProductInsights = async (product: Product): Promise<string> => {
  try {
    const response = await fetch("/api/products/appraise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data = await response.json();
    return data.insight || "Insight currently unavailable. Please check back later.";
  } catch (error) {
    console.error("AI Insights Client Error:", error);
    return "Our AI appraiser is currently taking a break. Please try again later.";
  }
};
