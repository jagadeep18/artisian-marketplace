import { supabase } from '../utils/supabaseClient';

export const reviewService = {
  async createReview(reviewData: any) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;

      // Update product rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', reviewData.product_id);

      if (reviews && reviews.length > 0) {
        const avgRating =
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

        await supabase
          .from('products')
          .update({ rating: avgRating })
          .eq('id', reviewData.product_id);
      }

      return { review: data, error: null };
    } catch (error: any) {
      return { review: null, error: error.message };
    }
  },

  async getProductReviews(productId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users!reviews_client_id_fkey(fullName)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { reviews: data || [], error: null };
    } catch (error: any) {
      return { reviews: [], error: error.message };
    }
  },

  async getArtisanRating(artisanId: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('rating')
        .eq('artisan_id', artisanId);

      if (error) throw error;

      const avgRating =
        data && data.length > 0
          ? data.reduce((sum, p) => sum + (p.rating || 0), 0) / data.length
          : 0;

      return { rating: avgRating, error: null };
    } catch (error: any) {
      return { rating: 0, error: error.message };
    }
  },
};
