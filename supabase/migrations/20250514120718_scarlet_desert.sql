/*
  # Admin function fixes

  1. Updates
    - Updates specific user to admin by email
    - Drops existing functions to avoid name conflicts
    - Recreates admin management functions with clear signatures

  2. Functions
    - set_admin_by_uuid(UUID): Set admin by user UUID
    - set_user_as_admin(TEXT): Set admin by personal ID
    - update_all_seller_landlord_to_admin(): Make all sellers/landlords admins
*/

-- Update the specific user to be an admin
UPDATE profiles
SET is_admin = true
FROM auth.users
WHERE auth.users.email = 'itsnoriy@gmail.com'
AND profiles.id = auth.users.id;

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS set_admin_by_uuid;
DROP FUNCTION IF EXISTS set_user_as_admin;
DROP FUNCTION IF EXISTS update_all_seller_landlord_to_admin;

-- Create function to set a user as admin by UUID with explicit parameter types
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

-- Create function to set a user as admin by personal ID with explicit parameter types
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
GRANT EXECUTE ON FUNCTION set_admin_by_uuid(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION set_user_as_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_all_seller_landlord_to_admin() TO authenticated;