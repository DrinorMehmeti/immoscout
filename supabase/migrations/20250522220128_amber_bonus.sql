/*
  # Fix property_views RLS policies

  1. Changes
     - Fix the INSERT policy on property_views table to properly allow both authenticated 
       and unauthenticated users to add property views
     - Ensures the policy has the correct WITH CHECK clause to validate inserted data

  2. Security
     - Maintains existing RLS on property_views table
     - Updates the policy to function as intended
*/

-- Drop the existing INSERT policy that isn't working correctly
DROP POLICY IF EXISTS "Anyone can add a property view" ON public.property_views;

-- Create a new, properly configured INSERT policy
CREATE POLICY "Anyone can add a property view" 
ON public.property_views
FOR INSERT 
TO public
WITH CHECK (
  -- Allow insertion for any property_id
  -- Ensure viewer_id is either the current user's ID or NULL for unauthenticated users
  (viewer_id IS NULL) OR (viewer_id = auth.uid())
);

-- Ensure RLS is enabled on the table (it should already be, but just to be safe)
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;