/*
  # Fix property_views INSERT policy

  This migration fixes the property_views table RLS policy to allow anyone to insert views.
  
  1. Changes
    - Drops the existing INSERT policy
    - Creates a new properly formatted INSERT policy without the invalid USING clause
    - Ensures RLS is enabled on the property_views table
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Anyone can add a property view" ON public.property_views;

-- Create a new, more permissive policy
-- Note: For INSERT policies, only WITH CHECK is used (no USING clause)
CREATE POLICY "Anyone can add a property view" 
ON public.property_views
FOR INSERT
TO public
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;