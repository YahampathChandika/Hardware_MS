// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const supabaseOperations = {
  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  async addCategory(name) {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateCategory(id, name) {
    const { data, error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteCategory(id) {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
  },

  // Products
  async getProducts(
    categoryId = null,
    searchTerm = "",
    sortBy = "name",
    sortOrder = "asc"
  ) {
    let query = supabase.from("products").select(`
        *,
        categories (
          id,
          name
        )
      `);

    // Filter by category
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    // Search by product name
    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    // Sort products
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async addProduct(product) {
    const { data, error } = await supabase.from("products").insert([product])
      .select(`
        *,
        categories (
          id,
          name
        )
      `);

    if (error) throw error;
    return data[0];
  },

  async updateProduct(id, product) {
    const { data, error } = await supabase
      .from("products")
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq("id", id).select(`
        *,
        categories (
          id,
          name
        )
      `);

    if (error) throw error;
    return data[0];
  },

  async deleteProduct(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
  },

  // Image operations
  async uploadImage(file, fileName) {
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(fileName);

    return publicUrl;
  },

  async deleteImage(fileName) {
    const { error } = await supabase.storage
      .from("product-images")
      .remove([fileName]);

    if (error) throw error;
  },

  getImageUrl(fileName) {
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(fileName);

    return publicUrl;
  },
};
