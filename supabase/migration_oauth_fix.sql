-- =============================================
-- ATELIER LAUNCH - OAUTH FIX MIGRATION
-- Run this in your Supabase SQL Editor
-- This fixes the issue where signing in with Google
-- causes a "Database error saving new user" due to NULL values.
-- =============================================

-- Google OAuth doesn't provide a 'user_type', so we must fall back to 'buyer'
-- It also might not provide 'full_name' perfectly, so we fall back to the email prefix
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, user_type)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)), 
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
