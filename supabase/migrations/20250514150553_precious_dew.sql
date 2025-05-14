/*
  # Fix admin functions

  1. Changes
    - Fix the set_admin_by_email function to handle text parameter
    - Add direct SQL update functions for admin management
    - Ensure proper error handling
*/

-- Drop the existing function if it exists to avoid the overloading issue
DROP FUNCTION IF EXISTS public.set_admin_by_email(user_email character varying);
DROP FUNCTION IF EXISTS public.set_admin_by_email(user_email text);

-- Create a new function that works with text parameter
CREATE OR REPLACE FUNCTION public.set_admin_by_email(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_exists boolean;
BEGIN
  -- Check if the user exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = user_email
  ) INTO user_exists;
  
  -- If user doesn't exist, return false
  IF NOT user_exists THEN
    RETURN false;
  END IF;
  
  -- Update the user's profile to set is_admin to true
  UPDATE profiles
  SET is_admin = true
  FROM auth.users
  WHERE auth.users.email = user_email
  AND profiles.id = auth.users.id;
  
  RETURN true;
END;
$$;

-- Create a function to set admin by UUID
CREATE OR REPLACE FUNCTION public.set_admin_by_uuid(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_exists boolean;
BEGIN
  -- Check if the user exists
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id
  ) INTO user_exists;
  
  -- If user doesn't exist, return false
  IF NOT user_exists THEN
    RETURN false;
  END IF;
  
  -- Update the user's profile to set is_admin to true
  UPDATE profiles
  SET is_admin = true
  WHERE id = user_id;
  
  RETURN true;
END;
$$;

-- Create a function to update all sellers and landlords to admin
CREATE OR REPLACE FUNCTION public.update_all_seller_landlord_to_admin()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count integer;
BEGIN
  -- Update all users with user_type 'seller' or 'landlord' to be admins
  UPDATE profiles
  SET is_admin = true
  WHERE user_type IN ('seller', 'landlord')
  AND is_admin = false;
  
  -- Get the number of rows affected
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN updated_count;
END;
$$;