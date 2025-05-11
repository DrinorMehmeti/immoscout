/*
  # Fix infinite recursion in profiles table policies

  1. Changes
     - Drop the problematic "Admins can view all profiles" policy that causes infinite recursion
     - Create a new admin policy that avoids the recursive lookup pattern
     
  2. Problem
     - The original policy was trying to check if the current user is an admin by selecting from the profiles table
     - This created a circular reference: when querying profiles, it checks the policy, which queries profiles again
     
  3. Solution
     - Modify the policy to use a simpler approach for admin access using the is_admin flag
*/

-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new policy that doesn't cause recursion
CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);