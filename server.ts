import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { db } from "./db/index.ts";
import { products, orders, orderItems } from "./db/schema.ts";
import { getOrCreateUser } from "./db/users.ts";
import { requireAuth, AuthRequest } from "./middleware/auth.ts";
import { eq } from "drizzle-orm";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Initialize Gemini API
  const aiApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const ai = aiApiKey ? new GoogleGenAI({ apiKey: aiApiKey }) : null;

  // --- API ROUTES ---

  // 1. Sync User Profile (called after client signs in)
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: Invalid user context" });
      }
      const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "", req.user.name);
      return res.json({ success: true, user: dbUser });
    } catch (error: any) {
      console.error("Error in sync-user route:", error);
      return res.status(500).json({ error: error.message || "Failed to synchronize user profile" });
    }
  });

  // 2. Fetch all products from Database
  app.get("/api/products", async (req, res) => {
    try {
      const results = await db.select().from(products);
      // Drizzle numeric columns return as string, let's map price to float/number for frontend
      const mappedResults = results.map(p => ({
        ...p,
        price: parseFloat(p.price as string),
        // Group location back into the sub-object form the client expects
        location: {
          city: p.city,
          country: p.country,
        }
      }));
      return res.json(mappedResults);
    } catch (error: any) {
      console.error("Error in get-products route:", error);
      return res.status(500).json({ error: "Failed to retrieve products from database" });
    }
  });

  // 3. Create a secondary advertisement/listing route
  app.post("/api/products", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { title, price, category, city, country, condition, description, image } = req.body;

      if (!title || !price || !category || !city || !country || !condition || !description) {
        return res.status(400).json({ error: "Missing required product details" });
      }

      // Synchronize/get DB user serial ID
      const userRecord = await getOrCreateUser(req.user.uid, req.user.email || "", req.user.name);

      const newId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const listedDate = new Date().toISOString().split("T")[0];

      await db.insert(products).values({
        id: newId,
        title,
        price: price.toString(), // numeric field expects string
        image: image || "https://picsum.photos/400/300?random=" + Math.floor(Math.random() * 20),
        category,
        city,
        country,
        condition,
        description,
        listedDate,
        sellerId: userRecord.id,
      });

      return res.json({
        success: true,
        product: {
          id: newId,
          title,
          price: parseFloat(price.toString()),
          image,
          category,
          location: { city, country },
          condition,
          description,
          listedDate,
        }
      });
    } catch (error: any) {
      console.error("Error creating product advertisement:", error);
      return res.status(500).json({ error: error.message || "Failed to list item for advertisement" });
    }
  });

  // 4. Create an Order Placement (Checkout) Route
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, shippingDetails, buyerEmail, userIdToken } = req.body;

      if (!items || !items.length || !shippingDetails || !buyerEmail) {
        return res.status(400).json({ error: "Incomplete order details or empty cart" });
      }

      let userId: number | null = null;
      if (userIdToken) {
        try {
          const decoded = await adminAuth.verifyIdToken(userIdToken);
          const userRec = await getOrCreateUser(decoded.uid, decoded.email || "", decoded.name);
          userId = userRec.id;
        } catch (authErr) {
          console.warn("Invalid ID token ignored for guest/standard checkout", authErr);
        }
      }

      // Compute total sum
      let total = 0;
      for (const item of items) {
        total += item.price * (item.quantity || 1);
      }

      // Generate random high-entropy tracking number
      const trackingSec = Math.floor(100000 + Math.random() * 900000);
      const trackingNumber = `AL-${trackingSec}-${shippingDetails.country.substring(0, 2).toUpperCase()}`;

      // Insert Order
      const insertedOrder = await db.insert(orders).values({
        userId,
        buyerEmail,
        totalAmount: total.toString(),
        shippingName: shippingDetails.name,
        shippingAddress: shippingDetails.address,
        shippingCity: shippingDetails.city,
        shippingCountry: shippingDetails.country,
        trackingNumber,
      }).returning();

      const orderId = insertedOrder[0].id;

      // Insert Order Items
      for (const item of items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.id,
          quantity: item.quantity || 1,
          price: item.price.toString(),
        });
      }

      return res.json({
        success: true,
        orderId,
        trackingNumber,
        totalAmount: total,
      });
    } catch (error: any) {
      console.error("Failed to process transaction order:", error);
      return res.status(500).json({ error: error.message || "Internal transaction error" });
    }
  });

  // 5. Track Order Route
  app.get("/api/orders/track/:trackingNumber", async (req, res) => {
    try {
      const { trackingNumber } = req.params;
      const orderRecords = await db.select().from(orders).where(eq(orders.trackingNumber, trackingNumber));

      if (!orderRecords.length) {
        return res.status(404).json({ error: "Order not found. Please verify tracking code." });
      }

      const order = orderRecords[0];

      // Retrieve associated list items
      const itemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

      const responsePayload = {
        ...order,
        totalAmount: parseFloat(order.totalAmount as string),
        items: itemsList.map(item => ({
          ...item,
          price: parseFloat(item.price as string),
        })),
      };

      return res.json(responsePayload);
    } catch (error: any) {
      console.error("Tracking order read error:", error);
      return res.status(500).json({ error: "Failed to fetch tracking records" });
    }
  });

  // 6. AI Appraiser Endpoint (Secure Gemini proxy)
  app.post("/api/products/appraise", async (req, res) => {
    try {
      const { product } = req.body;
      if (!product) {
        return res.status(400).json({ error: "Product payload missing" });
      }

      if (!ai) {
        return res.json({
          insight: "AI appraiser services are currently disabled. Configure GEMINI_API_KEY to enable."
        });
      }

      const prompt = `
        You are an expert appraiser for an online marketplace called "Alumni".
        Analyze this item: "${product.title}" listed for ${product.price} ${product.currency || "USD"} in ${product.location?.city || product.city}, ${product.location?.country || product.country}.
        Condition: ${product.condition}.
        Description: ${product.description}.

        Please provide a brief, professional assessment (max 100 words) covering:
        1. Whether this price seems fair for the current market.
        2. What a buyer should check for in photos regarding this specific type of item.
        3. A fun historical or cultural fact about this type of item.

        Tone: Helpful, knowledgeable, and trustworthy.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return res.json({ insight: response.text || "Insight currently unavailable. Please check back later." });
    } catch (error: any) {
      console.error("AI Gemini API appraiser proxy error:", error);
      return res.json({
        insight: "Our AI appraiser is currently taking a break. Please try again later."
      });
    }
  });


  // --- VITE / STATIC ASSET MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
