/*
  # Fix property views policy

  1. Changes
     - Updates the property_views table policy to allow anonymous users to insert views
     - Ensures both authenticated and unauthenticated users can record property views

  2. Security
     - Maintains appropriate checks to prevent abuse
     - Ensures data integrity by validating viewer_id matches auth.uid when authenticated
*/

-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Allow recording property views" ON property_views;

-- Create an updated policy that handles both authenticated and unauthenticated users
CREATE POLICY "Allow recording property views" 
ON property_views
FOR INSERT 
TO public
USING (true)
WITH CHECK (
  -- For authenticated users: viewer_id must be null or match the authenticated user id
  ((auth.uid() IS NOT NULL AND (viewer_id IS NULL OR viewer_id = auth.uid()))
  -- For anonymous users: viewer_id must be null
  OR (auth.uid() IS NULL AND viewer_id IS NULL))
);