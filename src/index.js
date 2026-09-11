import express from "express";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();

const app = express();

// Enable JSON body parsing
app.use(express.json());

// CORS & Preflight middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Root route - API info & health check
app.get("/", (req, res) => {
  res.json({
    name: "Sales API - PPB Kelompok 23",
    version: "1.0.0",
    status: "running",
    supabase_configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_KEY),
    endpoints: {
      categories: "/api/categories",
      products: "/api/products",
      customers: "/api/customers",
    },
    product_filter_examples: {
      all_products: "/api/products",
      by_category: "/api/products?category_id=1",
      by_name: "/api/products?name=laptop",
      by_price_range: "/api/products?min_price=100000&max_price=500000",
      in_stock_only: "/api/products?in_stock=true",
      combined: "/api/products?category_id=1&in_stock=true&min_price=50000",
    },
  });
});

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
});

// For local development
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for Vercel Serverless
export default app;