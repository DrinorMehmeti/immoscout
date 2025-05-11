/*
  # Fix infinite recursion in profiles RLS policy

  1. Changes
     - Drop the existing "Admins can view all profiles" policy that is causing an infinite recursion
     - Create a new admin policy that doesn't check the profiles table recursively
     - Use a boolean parameter to bypass RLS (auth.uid() = profiles.id OR auth.jwt()->>'is_admin' = 'true')
  
  2. Security
     - Maintain the security model allowing users to view their own profiles
     - Allow admins to view all profiles without causing infinite recursion
*/

-- Drop the policy that's causing infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new policy that doesn't cause recursion
-- This policy allows a user to view a profile if it's their own OR they have the is_admin claim
CREATE POLICY "Admins can view all profiles" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (
    -- Either the user is viewing their own profile OR they are an admin
    (auth.uid() = id) OR 
    -- Check if the user has is_admin = true in their JWT claims
    (auth.jwt()->>'is_admin' = 'true')
  );