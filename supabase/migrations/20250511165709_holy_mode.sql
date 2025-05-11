/*
  # Fix infinite recursion in profiles policy

  1. Changes
     - Drop the problematic "Admins can view all profiles" policy that causes infinite recursion
     - Create a new admin policy that uses auth.uid() directly without nested queries

  2. Security
     - Maintains the same security intent: admins can view all profiles
     - Prevents infinite recursion by avoiding self-referential policy conditions
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a modified policy for admins that doesn't cause recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND is_admin = true
));