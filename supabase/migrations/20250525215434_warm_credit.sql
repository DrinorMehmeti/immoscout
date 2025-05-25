/*
  # Fix property views RLS policy

  1. Changes
     - Drop existing property views policy
     - Create a new property views policy for INSERT operations
     - Fix syntax to use only WITH CHECK clause for INSERT
     
  2. Purpose
     - Allow both authenticated and anonymous users to record property views
     - Maintain security by validating viewer IDs
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