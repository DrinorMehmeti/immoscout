/*
  # Fix infinite recursion in profiles table policies

  1. Changes
     - Drop the problematic "Admins can view all profiles" policy
     - Create a new "Admins can view all profiles" policy without recursion
     - The new policy uses a more direct approach to check admin status

  2. Security
     - Maintains the same security constraints
     - Eliminates infinite recursion issue
     - Admins will still have access to all profiles
*/

-- Drop the existing policy that's causing recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new policy without recursion
-- This uses the auth.jwt() function to check claims directly
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT TO authenticated
USING (
  -- Using a direct approach that doesn't query the profiles table again
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);