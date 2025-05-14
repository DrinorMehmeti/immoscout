/*
  # Grant admin privileges to specific user
  
  1. Updates
    - Set specific user with email "itsnoriy@gmail.com" to be an admin
    - Create a helper function to set users as admin by email
  
  2. Functions
    - set_admin_by_email: Helper function to set a user as admin by their email
*/

-- Update the specific user to be an admin
UPDATE profiles
SET is_admin = true
FROM auth.users
WHERE auth.users.email = 'itsnoriy@gmail.com'
AND profiles.id = auth.users.id;

-- Drop the function if it exists to avoid the "function not unique" error
DROP FUNCTION IF EXISTS set_admin_by_email(TEXT);

-- Create a helper function to set users as admin by email
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION set_admin_by_email TO authenticated;