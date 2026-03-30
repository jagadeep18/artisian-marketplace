import { supabase } from '../utils/supabaseClient';

export const orderService = {
  async createOrder(orderData: any) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      return { order: data, error: null };
    } catch (error: any) {
      return { order: null, error: error.message };
    }
  },

  async getOrders(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products(*),
          users!orders_client_id_fkey(*)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { orders: data || [], error: null };
    } catch (error: any) {
      return { orders: [], error: error.message };
    }
  },

  async getOrderById(id: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products(*),
          users!orders_client_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return { order: data, error: null };
    } catch (error: any) {
      return { order: null, error: error.message };
    }
  },

  async updateOrderStatus(id: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { order: data, error: null };
    } catch (error: any) {
      return { order: null, error: error.message };
    }
  },

  async getArtisanOrders(artisanId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products!inner(*),
          users!orders_client_id_fkey(*)
        `)
        .eq('products.artisan_id', artisanId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { orders: data || [], error: null };
    } catch (error: any) {
      return { orders: [], error: error.message };
    }
  },
};
