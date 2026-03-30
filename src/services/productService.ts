import { supabase } from '../utils/supabaseClient';
import { Product } from '../types';

export const productService = {
  async getProducts(filters?: any) {
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          category,
          materials,
          inStock,
          featured,
          created_at,
          artisan_id,
          users!products_artisan_id_fkey(id, shopName, ownerName, mobileNumber, shopAddress, rating, totalReviews, verified)
        `);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { products: data || [], error: null };
    } catch (error: any) {
      return { products: [], error: error.message };
    }
  },

  async getProductById(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          users!products_artisan_id_fkey(*),
          product_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return { product: data, error: null };
    } catch (error: any) {
      return { product: null, error: error.message };
    }
  },

  async createProduct(productData: any) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      return { product: data, error: null };
    } catch (error: any) {
      return { product: null, error: error.message };
    }
  },

  async updateProduct(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { product: data, error: null };
    } catch (error: any) {
      return { product: null, error: error.message };
    }
  },

  async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getFeaturedProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(6);

      if (error) throw error;

      return { products: data || [], error: null };
    } catch (error: any) {
      return { products: [], error: error.message };
    }
  },

  async uploadProductImage(file: File, productId: string) {
    try {
      const fileName = `${productId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Save image metadata to database
      const { error: dbError } = await supabase
        .from('product_images')
        .insert([{ product_id: productId, image_url: data.publicUrl }]);

      if (dbError) throw dbError;

      return { imageUrl: data.publicUrl, error: null };
    } catch (error: any) {
      return { imageUrl: null, error: error.message };
    }
  },
};
