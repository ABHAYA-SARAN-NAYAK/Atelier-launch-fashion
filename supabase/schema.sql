-- =============================================
-- ATELIER LAUNCH DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE (extends Supabase auth.users)
-- =============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('buyer', 'student_designer', 'pro_designer')),
  avatar_url TEXT,
  phone TEXT,
  shipping_address JSONB,
  size_preferences TEXT[],
  style_preferences TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DESIGNER PROFILES TABLE
-- =============================================
CREATE TABLE public.designer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_name TEXT,
  school_name TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  specialization TEXT NOT NULL,
  bio TEXT,
  instagram_handle TEXT,
  portfolio_images TEXT[],
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_document TEXT,
  verification_message TEXT,
  follower_count INTEGER DEFAULT 0,
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================
-- COLLECTIONS TABLE
-- =============================================
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  designer_id UUID NOT NULL REFERENCES public.designer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  drop_start_date TIMESTAMPTZ NOT NULL,
  drop_end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'ended')),
  tags TEXT[],
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity_available INTEGER NOT NULL DEFAULT 0,
  sizes_available TEXT[] NOT NULL,
  primary_image TEXT,
  gallery_images TEXT[],
  materials TEXT,
  care_instructions TEXT,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'refunded', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method_last4 TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE SET NULL,
  designer_id UUID NOT NULL REFERENCES public.designer_profiles(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  size TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  payout_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FOLLOWS TABLE
-- =============================================
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.designer_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- =============================================
-- CART ITEMS TABLE
-- =============================================
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, size)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_collections_designer ON public.collections(designer_id);
CREATE INDEX idx_collections_status ON public.collections(status);
CREATE INDEX idx_collections_drop_dates ON public.collections(drop_start_date, drop_end_date);
CREATE INDEX idx_products_collection ON public.products(collection_id);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_designer ON public.order_items(designer_id);
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users: users can read all, update own
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Designer Profiles: public can read verified, owners can update
CREATE POLICY "Public can read verified designers" ON public.designer_profiles FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Designers can update own profile" ON public.designer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can do everything" ON public.designer_profiles FOR ALL USING (true) WITH CHECK (true);

-- Collections: public can read live, designers can manage own
CREATE POLICY "Public can view live collections" ON public.collections FOR SELECT USING (status = 'live' OR status = 'ended');
CREATE POLICY "Designers can manage own collections" ON public.collections FOR ALL USING (designer_id IN (SELECT id FROM designer_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Service role collections" ON public.collections FOR ALL USING (true) WITH CHECK (true);

-- Products: similar to collections
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (
  collection_id IN (SELECT id FROM collections WHERE status IN ('live', 'ended'))
);
CREATE POLICY "Designers can manage own products" ON public.products FOR ALL USING (
  collection_id IN (SELECT id FROM collections WHERE designer_id IN (SELECT id FROM designer_profiles WHERE user_id = auth.uid()))
);

-- Orders: users can view own, designers can view theirs
CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT USING (buyer_id = auth.uid());
CREATE POLICY "Designers can view their order items" ON public.order_items FOR SELECT USING (
  designer_id IN (SELECT id FROM designer_profiles WHERE user_id = auth.uid())
);

-- Follows: users can manage own
CREATE POLICY "Users can manage own follows" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- Cart: users can manage own
CREATE POLICY "Users can manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, user_type)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'user_type');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-create designer profile for designer signups
CREATE OR REPLACE FUNCTION public.handle_designer_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'user_type' IN ('student_designer', 'pro_designer') THEN
    INSERT INTO public.designer_profiles (user_id, school_name, graduation_year, specialization)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'school',
      (NEW.raw_user_meta_data->>'graduation_year')::INTEGER,
      NEW.raw_user_meta_data->>'specialization'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_designer_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_designer_signup();

-- Auto-update collection status based on dates
CREATE OR REPLACE FUNCTION public.update_collection_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.drop_end_date < NOW() AND NEW.status = 'live' THEN
    NEW.status := 'ended';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_collection_status
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION public.update_collection_status();

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('products', 'products', true),
  ('collections', 'collections', true),
  ('portfolio', 'portfolio', true);

-- Storage policies
CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Designers can upload products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');

CREATE POLICY "Public can view collections" ON storage.objects FOR SELECT USING (bucket_id = 'collections');
CREATE POLICY "Designers can upload collection images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'collections');

CREATE POLICY "Public can view portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Designers can upload portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');

-- =============================================
-- SEED DATA (Optional - for testing)
-- =============================================
-- Comment out if you want to start fresh
/*
INSERT INTO public.users (id, email, full_name, user_type) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'designer@example.com', 'Maya Chen', 'student_designer');

INSERT INTO public.designer_profiles (user_id, brand_name, school_name, graduation_year, specialization, bio, verification_status, follower_count) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Maya Chen', 'Parsons School of Design', 2025, 'Womenswear', 'Creating sustainable, gender-fluid fashion', 'verified', 1247);
*/