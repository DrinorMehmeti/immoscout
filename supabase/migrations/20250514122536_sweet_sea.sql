/*
  # Fix admin management functions

  1. Changes:
    - Drop existing conflicting functions first
    - Create admin management functions with explicit parameter types
    - Grant execute permissions with explicit parameter types
  
  2. Security:
    - All functions have SECURITY DEFINER to ensure they run with proper permissions
    - Explicit search_path to prevent search_path injection
*/

-- First drop any existing functions to avoid conflicts
DROP FUNCTION IF EXISTS set_admin_by_uuid(UUID);
DROP FUNCTION IF EXISTS set_user_as_admin(TEXT);
DROP FUNCTION IF EXISTS update_all_seller_landlord_to_admin();
DROP FUNCTION IF EXISTS set_admin_by_email(TEXT);

-- Create function to set a user as admin by email
CREATE OR REPLACE FUNCTION set_admin_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update user and count how many rows were affected
  WITH updated_profiles AS (
    UPDATE profiles
    SET is_admin = true
    FROM auth.users
    WHERE auth.users.email = user_email
    AND profiles.id = auth.users.id
    RETURNING profiles.id
  )
  SELECT COUNT(*) INTO updated_count FROM updated_profiles;
  
  -- Return true if we found and updated the user, false otherwise
  RETURN updated_count > 0;
END;
$$;

-- Create function to set a user as admin by UUID
CREATE OR REPLACE FUNCTION set_admin_by_uuid(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update the user's profile and count affected rows
  WITH updated_profiles AS (
    UPDATE profiles
    SET is_admin = true
    WHERE id = user_id
    RETURNING id
  )
  SELECT COUNT(*) INTO updated_count FROM updated_profiles;
  
  -- Return true if the user was found and updated
  RETURN updated_count > 0;
END;
$$;

-- Create function to set a user as admin by personal ID
CREATE OR REPLACE FUNCTION set_user_as_admin(user_personal_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update the user's profile and count affected rows
  WITH updated_profiles AS (
    UPDATE profiles
    SET is_admin = true
    WHERE personal_id = user_personal_id
    RETURNING id
  )
  SELECT COUNT(*) INTO updated_count FROM updated_profiles;
  
  -- Return true if the user was found and updated
  RETURN updated_count > 0;
END;
$$;

-- Create function to update all sellers and landlords to be admins
CREATE OR REPLACE FUNCTION update_all_seller_landlord_to_admin()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update all users with user_type 'seller' or 'landlord' and count affected rows
  WITH updated_profiles AS (
    UPDATE profiles
    SET is_admin = true
    WHERE user_type IN ('seller', 'landlord')
    RETURNING id
  )
  SELECT COUNT(*) INTO updated_count FROM updated_profiles;
  
  -- Return the number of users updated
  RETURN updated_count;
END;
$$;

-- Grant execute permissions with explicit parameter types
GRANT EXECUTE ON FUNCTION set_admin_by_uuid(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION set_user_as_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION set_admin_by_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_all_seller_landlord_to_admin() TO authenticated;