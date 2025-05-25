/*
  # Fix property views RLS policy

  1. Security
    - Fix the property views table policy to allow proper recording of views
    - Ensure both authenticated and anonymous users can record views
    - Properly implement WITH CHECK expression for INSERT policy
*/

-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Allow recording property views" ON property_views;

-- Create an updated policy that handles both authenticated and unauthenticated users
-- For INSERT policies, only WITH CHECK expression is allowed (not USING)
CREATE POLICY "Allow recording property views" 
ON property_views
FOR INSERT 
TO public
WITH CHECK (
  -- For authenticated users: viewer_id must be null or match the authenticated user id
  ((auth.uid() IS NOT NULL AND (viewer_id IS NULL OR viewer_id = auth.uid()))
  -- For anonymous users: viewer_id must be null
  OR (auth.uid() IS NULL AND viewer_id IS NULL))
);