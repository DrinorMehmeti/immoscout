/*
  # Fix Property Views RLS Policy

  1. Changes:
    - Drops existing INSERT policy on property_views table
    - Creates new policy allowing anyone (authenticated and anonymous) to add property views
    - Ensures RLS is enabled on the table
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Anyone can add a property view" ON public.property_views;

-- Create a new, more permissive policy
CREATE POLICY "Anyone can add a property view" 
ON public.property_views
FOR INSERT
TO public
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;