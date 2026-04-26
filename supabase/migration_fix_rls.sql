-- =============================================
-- ATELIER LAUNCH - RLS POLICY MIGRATION
-- Run this in your Supabase SQL Editor
-- This fixes missing policies that prevent
-- proper sign-in, profile creation, and order reading
-- =============================================

-- ============================================
-- FIX 1: Users table - Allow users to insert their own profile
-- The handle_new_user trigger uses SECURITY DEFINER but
-- the client-side fallback createProfile() needs this policy
-- =============================================
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- FIX 2: Designer profiles - Let designers read their OWN profile
-- even when verification_status is 'pending'
-- Drop the old restrictive policy first
-- =============================================
DROP POLICY IF EXISTS "Public can read verified designers" ON public.designer_profiles;

CREATE POLICY "Public can read verified or own designer profiles"
  ON public.designer_profiles FOR SELECT
  USING (
    verification_status = 'verified'
    OR auth.uid() = user_id
  );

-- Also allow designers to INSERT their own profile (in case trigger fails)
CREATE POLICY "Designers can insert own profile"
  ON public.designer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- FIX 3: Orders - Allow buyers to CREATE orders
-- =============================================
CREATE POLICY "Buyers can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- =============================================
-- FIX 4: Order items - Allow buyers to READ their own order items
-- (Previously only designers could read order items)
-- =============================================
CREATE POLICY "Buyers can view their order items"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
  );

-- Allow buyers to INSERT order items for their orders
CREATE POLICY "Buyers can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
  );

-- =============================================
-- FIX 5: Collections - allow draft collections to be visible to owner
-- =============================================
DROP POLICY IF EXISTS "Public can view live collections" ON public.collections;

CREATE POLICY "Public can view live or own collections"
  ON public.collections FOR SELECT
  USING (
    status IN ('live', 'ended')
    OR designer_id IN (SELECT id FROM designer_profiles WHERE user_id = auth.uid())
  );

-- =============================================
-- FIX 6: Products - allow products from draft collections to be visible to owner
-- =============================================
DROP POLICY IF EXISTS "Public can view products" ON public.products;

CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  USING (
    collection_id IN (SELECT id FROM collections WHERE status IN ('live', 'ended'))
    OR collection_id IN (
      SELECT id FROM collections
      WHERE designer_id IN (SELECT id FROM designer_profiles WHERE user_id = auth.uid())
    )
  );

-- =============================================
-- FIX 7: Follows - allow users to read who they follow
-- =============================================
DROP POLICY IF EXISTS "Users can manage own follows" ON public.follows;

CREATE POLICY "Users can manage own follows"
  ON public.follows FOR ALL
  USING (auth.uid() = follower_id);

-- Also allow reading follow counts for any designer
CREATE POLICY "Public can read follows"
  ON public.follows FOR SELECT
  USING (true);

-- =============================================
-- DONE! All policies applied.
-- =============================================
