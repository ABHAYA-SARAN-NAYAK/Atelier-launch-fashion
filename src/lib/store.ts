import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, usersApi, designersApi, cartApi } from './api';
import { supabase } from './supabase';
import type { User, DesignerProfile, Product } from '../types';

interface AppState {
  user: User | null;
  designerProfile: DesignerProfile | null;
  isAuthenticated: boolean;
  isDesignerVerified: boolean;
  cartItems: Array<{
    id: string;
    product_id: string;
    product: Product;
    size: string;
    quantity: number;
  }>;
  isCartOpen: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setDesignerProfile: (profile: DesignerProfile | null) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, data: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, size: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      designerProfile: null,
      isAuthenticated: false,
      isDesignerVerified: false,
      cartItems: [],
      isCartOpen: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setDesignerProfile: (profile) => set({ 
        designerProfile: profile,
        isDesignerVerified: profile?.verification_status === 'verified'
      }),
      
      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          await authApi.signInWithGoogle();
        } catch (err: unknown) {
          console.error('Google login failed:', err);
          set({ isLoading: false });
          throw err;
        }
        // It redirects, so we don't set isLoading to false here to prevent flashing
      },

      loginWithEmail: async (email, pass) => {
        set({ isLoading: true });
        try {
          await authApi.signInWithEmail(email, pass);
          await get().checkAuth();
        } catch (err: unknown) {
          console.error('Email login failed:', err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      signupWithEmail: async (email, pass, data) => {
        set({ isLoading: true });
        try {
          // Pass metadata to Supabase for the handle_new_user trigger
          const metadata = {
            full_name: data.fullName,
            user_type: data.userType === 'designer' ? 'student_designer' : 'buyer',
            school: data.school,
            graduation_year: data.graduationYear,
            specialization: data.specialization
          };
          await authApi.signUpWithEmail(email, pass, metadata);
          await get().checkAuth();
        } catch (err: unknown) {
          console.error('Email signup failed:', err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await authApi.signOut();
        set({ user: null, designerProfile: null, isAuthenticated: false, isDesignerVerified: false, cartItems: [] });
      },

      checkAuth: async () => {
        try {
          const session = await authApi.getSession();
          if (session?.user) {
            const authUser = session.user;

            // Check if we have pending signup data in localStorage
            const pendingSignup = localStorage.getItem('pending_signup');
            if (pendingSignup) {
              try {
                const userData = JSON.parse(pendingSignup);
                // Create profile with captured data
                await usersApi.createProfile(authUser.id, {
                  email: authUser.email || '',
                  full_name: userData.fullName || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                  user_type: userData.userType === 'designer' ? 'student_designer' : 'buyer',
                });
                
                // If it's a designer, also create their pending profile row automatically if possible,
                // or just rely on the API. (Supabase will upsert)
                // In this case, `designersApi.update` doesn't exist to upsert, but we can hit public.designer_profiles
                if (userData.userType === 'designer' && userData.school) {
                  // Manually upsert to designer profile since trigger won't have metadata if logging in via Google
                  const { error } = await supabase.from('designer_profiles').upsert({
                    user_id: authUser.id,
                    school_name: userData.school,
                    graduation_year: parseInt(userData.graduationYear),
                    specialization: userData.specialization
                  }, { onConflict: 'user_id' });
                  if (error) console.error('Failed creating designer specific row:', error);
                }

                // Clear the local storage
                localStorage.removeItem('pending_signup');
              } catch (e) {
                console.error('Error parsing/processing pending signup:', e);
                localStorage.removeItem('pending_signup'); // still clear to avoid loop
              }
            }

            try {
              const profile = await usersApi.getProfile(authUser.id);
              set({ user: profile, isAuthenticated: true });
              if (profile.user_type === 'student_designer' || profile.user_type === 'pro_designer') {
                const dp = await designersApi.getByUserId(authUser.id).catch(() => null);
                if (dp) set({ designerProfile: dp, isDesignerVerified: dp.verification_status === 'verified' });
              }
              const items = await cartApi.getItems(authUser.id).catch(() => []);
              set({ cartItems: items });
            } catch {
              // User has no valid profile (and no local storage data to create it)
              // Just fallback to buyer.
              const fallbackType = (authUser.user_metadata?.user_type as 'buyer' | 'student_designer' | 'pro_designer') || 'buyer';
              set({ 
                user: {
                  id: authUser.id,
                  email: authUser.email || '',
                  full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                  user_type: fallbackType,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }, 
                isAuthenticated: true 
              });
            }
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      },

      fetchCart: async () => {
        const { user } = get();
        if (!user) return;
        try {
          const items = await cartApi.getItems(user.id);
          set({ cartItems: items });
        } catch { /* ignore */ }
      },

      addToCart: async (product, size, quantity = 1) => {
        const { user, cartItems } = get();
        
        if (!user) {
          const existingItem = cartItems.find(item => item.product_id === product.id && item.size === size);
          if (existingItem) {
            set({ cartItems: cartItems.map(item => item.id === existingItem.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.quantity_available) } : item) });
          } else {
            set({ cartItems: [...cartItems, { id: `${product.id}-${size}-${Date.now()}`, product_id: product.id, product, size, quantity }] });
          }
          return;
        }

        try {
          await cartApi.addItem(user.id, product.id, size, quantity);
          await get().fetchCart();
        } catch {
          const existingItem = cartItems.find(item => item.product_id === product.id && item.size === size);
          if (existingItem) {
            set({ cartItems: cartItems.map(item => item.id === existingItem.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.quantity_available) } : item) });
          } else {
            set({ cartItems: [...cartItems, { id: `${product.id}-${size}-${Date.now()}`, product_id: product.id, product, size, quantity }] });
          }
        }
      },

      removeFromCart: async (productId) => {
        const { user, cartItems } = get();
        if (!user) {
          set({ cartItems: cartItems.filter(item => item.product_id !== productId) });
          return;
        }
        try {
          const item = cartItems.find(i => i.product_id === productId);
          if (item) await cartApi.removeItem(item.id);
          await get().fetchCart();
        } catch {
          set({ cartItems: cartItems.filter(item => item.product_id !== productId) });
        }
      },

      updateCartItemQuantity: async (productId, quantity) => {
        const { user, cartItems } = get();
        if (!user) {
          if (quantity <= 0) {
            set({ cartItems: cartItems.filter(item => item.product_id !== productId) });
          } else {
            set({ cartItems: cartItems.map(item => item.product_id === productId ? { ...item, quantity: Math.min(quantity, item.product.quantity_available) } : item) });
          }
          return;
        }
        try {
          const item = cartItems.find(i => i.product_id === productId);
          if (item) await cartApi.updateQuantity(item.id, quantity);
          await get().fetchCart();
        } catch {
          if (quantity <= 0) set({ cartItems: cartItems.filter(item => item.product_id !== productId) });
          else set({ cartItems: cartItems.map(item => item.product_id === productId ? { ...item, quantity: Math.min(quantity, item.product.quantity_available) } : item) });
        }
      },

      clearCart: async () => {
        const { user } = get();
        if (user) try { await cartApi.clearCart(user.id); } catch { /* ignore */ }
        set({ cartItems: [] });
      },
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      getCartTotal: () => get().cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0),
      getCartItemsCount: () => get().cartItems.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'atelier-launch-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);

// Auth listener — only handles sign-out & token refresh.
// Sign-in is handled by store.login() / store.signup() to avoid race conditions.
supabase.auth.onAuthStateChange(async (event, _session) => {
  const store = useStore.getState();

  if (event === 'SIGNED_OUT') {
    store.setUser(null);
    store.setDesignerProfile(null);
    useStore.setState({ isAuthenticated: false, isDesignerVerified: false, cartItems: [] });
  } else if (event === 'TOKEN_REFRESHED') {
    // Optionally re-check auth to refresh profile data
    if (!store.isAuthenticated) {
      await store.checkAuth();
    }
  }
});