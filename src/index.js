import express from "express";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Root route - API info
app.get("/", (req, res) => {
  res.json({
    name: "Sales API - PPB Kelompok 23",
    version: "1.0.0",
    status: "running",
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

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});