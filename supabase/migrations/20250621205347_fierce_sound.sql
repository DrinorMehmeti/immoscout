/*
  # Fix infinite recursion in profiles RLS policies

  1. Security Functions
    - Create `is_admin_user()` function with SECURITY DEFINER to bypass RLS
    - This function safely checks if the current user is an admin without triggering RLS recursion
  
  2. Policy Updates
    - Drop the existing problematic "Admins can view all profiles" policy
    - Create a new simplified policy using the security function
    - Keep other policies unchanged as they don't cause recursion

  3. Performance
    - Add index on is_admin column for better performance
*/

-- Create a SECURITY DEFINER function to check if current user is admin
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new admin policy using the security function
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = id) OR is_admin_user()
  );

-- Ensure the index exists for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION is_admin_user() TO authenticated;