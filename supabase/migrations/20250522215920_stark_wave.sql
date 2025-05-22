/*
  # Fix property_views RLS policy
  
  1. Changes
     - Drop existing INSERT policy for property_views table
     - Create new INSERT policy that explicitly handles both authenticated and unauthenticated users
     
  2. Security
     - Ensures both authenticated users and anonymous visitors can add property views
     - Maintains existing SELECT policy for property owners
*/

-- Drop the existing policy that's not working correctly
DROP POLICY IF EXISTS "Anyone can add a view" ON public.property_views;

-- Create a new INSERT policy that explicitly handles both authenticated and anonymous users
CREATE POLICY "Anyone can add a property view" ON public.property_views
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure the property_views table has RLS enabled
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;