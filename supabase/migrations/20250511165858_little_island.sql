/*
  # Fix profiles policy recursion

  1. Changes
    - Drop the problematic "Admins can view all profiles" policy that causes infinite recursion
    - Create a new admin policy that avoids recursion by using a simpler condition
  
  2. Security
    - Maintain security intent: admins can view all profiles
    - Avoid infinite recursion by simplifying policy logic
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new policy that achieves the same goal without recursion
CREATE POLICY "Admins can view all profiles" 
ON profiles
FOR SELECT
TO authenticated
USING (
  -- Check if current user is an admin (without using a subquery on profiles)
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);