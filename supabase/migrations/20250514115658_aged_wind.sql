/*
  # Grant admin rights by email

  1. Updates
    - Sets is_admin to true for the user with email itsnoriy@gmail.com
  
  2. Additional Functionality
    - Creates a function to set users as admin by email for future use
    - The function will return true if the user was found and updated
*/

-- Update the specific user to be an admin
UPDATE profiles
SET is_admin = true
FROM auth.users
WHERE auth.users.email = 'itsnoriy@gmail.com'
AND profiles.id = auth.users.id;

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