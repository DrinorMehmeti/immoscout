/*
  # Admin Authentication Helper Functions
  
  1. New Functions
    - `set_admin_by_uuid`: Sets a user as admin by their UUID
    - `set_user_as_admin`: Sets a user as admin by their personal ID
    - `update_all_seller_landlord_to_admin`: Updates all users with user_type 'seller' or 'landlord' to have admin privileges
  
  2. Security
    - All functions are configured as SECURITY DEFINER to run with elevated privileges
    - Strict schema search paths are set to prevent search path injection
    - Execute permissions are granted to authenticated users
*/

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

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION set_admin_by_uuid TO authenticated;
GRANT EXECUTE ON FUNCTION set_user_as_admin TO authenticated;
GRANT EXECUTE ON FUNCTION update_all_seller_landlord_to_admin TO authenticated;