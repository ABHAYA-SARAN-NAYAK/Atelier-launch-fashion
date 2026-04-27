import { supabase } from './supabase';
import type { 
  User, 
  DesignerProfile, 
  Collection, 
  Product, 
  Order, 
  CartItem,
  CollectionFilters 
} from '../types';

// ============ AUTH ============

export const authApi = {
  signInWithGoogle: async () => {
    console.log('API: signInWithGoogle called');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  },

  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signUpWithEmail: async (email: string, password: string, userData: Record<string, any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
};

// ============ USERS ============

export const usersApi = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    return data as User;
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },

  createProfile: async (userId: string, userData: {
    email: string;
    full_name: string;
    user_type: string;
    school?: string;
    graduation_year?: number;
    specialization?: string;
  }) => {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: userData.email,
        full_name: userData.full_name,
        user_type: userData.user_type,
      })
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },
};

// ============ DESIGNERS ============

export const designersApi = {
  getAll: async (filters?: { school?: string; specialization?: string }) => {
    let query = supabase
      .from('designer_profiles')
      .select('*')
      .eq('verification_status', 'verified');

    if (filters?.school) {
      query = query.eq('school_name', filters.school);
    }
    if (filters?.specialization) {
      query = query.eq('specialization', filters.specialization);
    }

    const { data, error } = await query.order('follower_count', { ascending: false });
    if (error) throw error;
    return data as DesignerProfile[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('designer_profiles')
      .select('*, user:users(full_name, email, avatar_url)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as DesignerProfile;
  },

  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('designer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) return null;
    return data as DesignerProfile;
  },

  update: async (id: string, updates: Partial<DesignerProfile>) => {
    const { data, error } = await supabase
      .from('designer_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as DesignerProfile;
  },
};

// ============ COLLECTIONS ============

export const collectionsApi = {
  getAll: async (filters?: CollectionFilters) => {
    let query = supabase
      .from('collections')
      .select('*, designer:designer_profiles(*), products(*)')
      .order('drop_start_date', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.school && filters.school.length > 0) {
      query = query.in('designer.school_name', filters.school);
    }
    if (filters?.specialization && filters.specialization.length > 0) {
      query = query.in('designer.specialization', filters.specialization);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Collection[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('collections')
      .select('*, designer:designer_profiles(*), products(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Collection;
  },

  getLive: async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*, designer:designer_profiles(*), products(*)')
      .eq('status', 'live')
      .order('drop_end_date', { ascending: true })
      .limit(3);
    if (error) throw error;
    return data as Collection[];
  },

  create: async (collection: Partial<Collection>) => {
    const { data, error } = await supabase
      .from('collections')
      .insert(collection)
      .select()
      .single();
    if (error) throw error;
    return data as Collection;
  },

  update: async (id: string, updates: Partial<Collection>) => {
    const { data, error } = await supabase
      .from('collections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Collection;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============ PRODUCTS ============

export const productsApi = {
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*, collection:collections(designer:designer_profiles(*))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Product;
  },

  create: async (product: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },

  update: async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============ ORDERS ============

export const ordersApi = {
  getByBuyer: async (buyerId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Order[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*), designer:designer_profiles(*))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Order;
  },

  create: async (order: {
    buyer_id: string;
    subtotal: number;
    shipping_cost: number;
    platform_fee: number;
    total: number;
    shipping_address: Record<string, unknown>;
    items: Array<{
      product_id: string;
      designer_id: string;
      quantity: number;
      size: string;
      price: number;
      payout_amount: number;
    }>;
  }) => {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: order.buyer_id,
        status: 'paid',
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        platform_fee: order.platform_fee,
        total: order.total,
        shipping_address: order.shipping_address,
      })
      .select()
      .single();
    
    if (orderError) throw orderError;

    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      designer_id: item.designer_id,
      quantity: item.quantity,
      size: item.size,
      price: item.price,
      payout_amount: item.payout_amount,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;

    return orderData as Order;
  },

  updateStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  },
};

// ============ FOLLOWS ============

export const followsApi = {
  follow: async (followerId: string, designerId: string) => {
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: designerId });
    if (error) throw error;
  },

  unfollow: async (followerId: string, designerId: string) => {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', designerId);
    if (error) throw error;
  },

  isFollowing: async (followerId: string, designerId: string) => {
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', designerId)
      .single();
    if (error) return false;
    return !!data;
  },

  getFollowers: async (designerId: string) => {
    const { data, error } = await supabase
      .from('follows')
      .select('*, user:users(*)')
      .eq('following_id', designerId);
    if (error) throw error;
    return data;
  },
};

// ============ CART ============

export const cartApi = {
  getItems: async (userId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*, collection:collections(designer:designer_profiles(*)))')
      .eq('user_id', userId);
    if (error) throw error;
    return data as CartItem[];
  },

  addItem: async (userId: string, productId: string, size: string, quantity: number) => {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, size, quantity })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
      return null;
    }
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  removeItem: async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    if (error) throw error;
  },

  clearCart: async (userId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  },
};

// ============ REALTIME SUBSCRIPTIONS ============

export const subscribeToCollection = (collectionId: string, callback: (payload: unknown) => void) => {
  return supabase
    .channel(`collection:${collectionId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'collections', filter: `id=eq.${collectionId}` }, callback)
    .subscribe();
};

export const subscribeToOrders = (userId: string, callback: (payload: unknown) => void) => {
  return supabase
    .channel(`orders:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `buyer_id=eq.${userId}` }, callback)
    .subscribe();
};

// ============ STORAGE ============

export const storageApi = {
  uploadImage: async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};