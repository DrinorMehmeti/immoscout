/*
  # Fix property_views RLS policy

  1. Changes
    - Drop the existing insert policy for property_views
    - Create a new, more permissive insert policy for property_views that properly handles both authenticated and anonymous users
  
  2. Security
    - Maintains security by ensuring users can only set their own ID when authenticated
    - Allows anonymous views with NULL viewer_id
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Anyone can add a property view" ON property_views;

-- Create a new, more permissive insert policy
CREATE POLICY "Anyone can add a property view" 
ON property_views
FOR INSERT 
TO public
WITH CHECK (
  -- Either the viewer_id is NULL (anonymous user)
  viewer_id IS NULL
  OR 
  -- Or the viewer_id matches the authenticated user's ID
  (auth.uid() = viewer_id)
);

-- Ensure the SELECT policy remains unchanged
-- This policy is already present but shown here for reference
-- Property owners can still view all views for their properties