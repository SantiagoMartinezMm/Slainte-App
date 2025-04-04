import { create } from 'zustand';
import { s as supabase } from './supabase_3ag640aW.mjs';

const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAdmin: false });
  },
  checkUser: async () => {
    try {
      set({ loading: true });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        set({
          user,
          profile,
          isAdmin: profile?.role === "admin"
        });
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      set({ loading: false });
    }
  }
}));

export { useAuthStore as u };
