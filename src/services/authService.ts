import { supabase } from '../utils/supabaseClient';
import { User, Artisan, Client } from '../types';
import bcryptjs from 'bcryptjs';

export const authService = {
  async signUp(email: string, password: string, userData: any) {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('User creation failed');

      // Create user profile in database
      const { data, error } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          role: userData.role,
          fullName: userData.fullName || null,
          mobileNumber: userData.mobileNumber || null,
          shopName: userData.shopName || null,
          ownerName: userData.ownerName || null,
          shopAddress: userData.shopAddress || null,
          pinCode: userData.pinCode || null,
          verified: false,
          rating: 0,
          totalReviews: 0,
        },
      ]);

      if (error) throw error;

      return { user: authData.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      return { user: userData, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (!data.user) return null;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      return userData;
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { user: data, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        callback(userData);
      } else {
        callback(null);
      }
    });
  },
};
