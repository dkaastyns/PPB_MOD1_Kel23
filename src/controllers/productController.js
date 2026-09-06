import { ProductModel } from "../models/productModel.js";

export const ProductController = {
  async getAll(req, res) {
    try {
      const { category_id, name, min_price, max_price, in_stock } = req.query;

      const filters = {};

      // Parse category_id as integer
      if (category_id !== undefined) {
        const parsed = parseInt(category_id, 10);
        if (isNaN(parsed)) {
          return res.status(400).json({ error: "category_id must be a valid integer" });
        }
        filters.category_id = parsed;
      }

      // Name filter (string)
      if (name !== undefined) {
        filters.name = name;
      }

      // Parse min_price as float
      if (min_price !== undefined) {
        const parsed = parseFloat(min_price);
        if (isNaN(parsed)) {
          return res.status(400).json({ error: "min_price must be a valid number" });
        }
        filters.min_price = parsed;
      }

      // Parse max_price as float
      if (max_price !== undefined) {
        const parsed = parseFloat(max_price);
        if (isNaN(parsed)) {
          return res.status(400).json({ error: "max_price must be a valid number" });
        }
        filters.max_price = parsed;
      }

      // Validate min <= max
      if (filters.min_price !== undefined && filters.max_price !== undefined) {
        if (filters.min_price > filters.max_price) {
          return res.status(400).json({ error: "min_price cannot be greater than max_price" });
        }
      }

      // Parse in_stock as boolean
      if (in_stock !== undefined) {
        filters.in_stock = in_stock === "true";
      }

      const products = await ProductModel.getAll(filters);

      res.json({
        filters_applied: filters,
        total: products.length,
        data: products,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const product = await ProductModel.getById(req.params.id);
      res.json(product);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const product = await ProductModel.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const product = await ProductModel.update(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await ProductModel.remove(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};