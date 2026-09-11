import { supabase } from "../config/supabaseClient.js";

export const ProductModel = {
  async getAll(filters = {}) {
    let query = supabase
      .from("products")
      .select("id, sku, name, description, price, stock, category_id");

    // Filter by category_id
    if (filters.category_id !== undefined) {
      query = query.eq("category_id", filters.category_id);
    }

    // Filter by name (partial, case-insensitive)
    if (filters.name !== undefined && filters.name.trim() !== "") {
      query = query.ilike("name", `%${filters.name.trim()}%`);
    }

    // Filter by minimum price
    if (filters.min_price !== undefined) {
      query = query.gte("price", filters.min_price);
    }

    // Filter by maximum price
    if (filters.max_price !== undefined) {
      query = query.lte("price", filters.max_price);
    }

    // Filter only in-stock products
    if (filters.in_stock === true) {
      query = query.gt("stock", 0);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id, sku, name, description, price, stock, category_id,
        categories ( id, name )
        `
      )
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("products")
      .insert([payload])
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return { message: "Product deleted successfully" };
  },
};