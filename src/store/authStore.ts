import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

// Mock user data for demo login
const MOCK_USER = {
  id: 'mock-user-id',
  email: 'sriharsha@gmail.com',
  user_metadata: {
    name: 'Sri Harsha',
    role: 'QA Engineer'
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signIn: async (email: string, password: string) => {
    try {
      // Mock authentication for demo credentials
      if (email === 'sriharsha@gmail.com' && password === 'Harsha@45') {
        set({ user: MOCK_USER as any, error: null });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      set({ user: data.user, error: null });
    } catch (error: any) {
      set({ error: 'Invalid email or password. Please try again.' });
      throw error;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, error: null });
    } catch (error: any) {
      set({ error: 'Error signing out. Please try again.' });
      throw error;
    }
  },
  setUser: (user) => set({ user, loading: false }),
  resetPassword: async (email: string) => {
    try {
      // Mock reset password for demo account
      if (email === 'sriharsha@gmail.com') {
        set({ error: 'Password reset is disabled for demo account' });
        throw new Error('Password reset is disabled for demo account');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  clearError: () => set({ error: null })
}));