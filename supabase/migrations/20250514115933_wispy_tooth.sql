/*
  # Make user admin by email and create admin management functions
  
  1. Updates the specific user with email 'itsnoriy@gmail.com' to be an admin
  2. Creates a new function to set users as admin by their email
  3. Ensures uniqueness by using a more specific function name
*/

-- Update the specific user to be an admin
UPDATE profiles
SET is_admin = true
FROM auth.users
WHERE auth.users.email = 'itsnoriy@gmail.com'
AND profiles.id = auth.users.id;

-- Drop all versions of the function if they exist to avoid the "function not unique" error
DROP FUNCTION IF EXISTS set_admin_by_email(TEXT);
DROP FUNCTION IF EXISTS set_user_admin_by_email(TEXT);

-- Create a helper function with a more unique name to set users as admin by email
CREATE OR REPLACE FUNCTION set_user_admin_by_email(user_email TEXT)
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
GRANT EXECUTE ON FUNCTION set_user_admin_by_email TO authenticated;