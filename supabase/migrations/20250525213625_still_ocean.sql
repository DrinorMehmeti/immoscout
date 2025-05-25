/*
  # Fix property_views RLS policy for recording views
  
  1. Changes
     - Corrects the RLS policy for INSERT operations on property_views table
     - Removes incorrect USING clause (only WITH CHECK is allowed for INSERT policies)
     - Maintains the same permissions logic for both authenticated and anonymous users
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