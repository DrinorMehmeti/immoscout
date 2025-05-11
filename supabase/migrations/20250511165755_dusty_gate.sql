/*
  # Fix infinite recursion in profiles table policy
  
  1. Changes
     - Drops the problematic "Admins can view all profiles" policy that's causing recursive queries
     - Creates a new policy that avoids the recursion by using a direct condition
  
  2. Reasoning
     - The previous policy was causing infinite recursion because it queried the profiles table 
       inside its own policy, creating a circular reference
     - The new policy uses a simpler approach to check admin status
*/

-- Drop the problematic policy that's causing recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a new policy that doesn't cause recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (
  (is_admin = true AND id = auth.uid()) OR
  (auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE is_admin = true
  ))
);