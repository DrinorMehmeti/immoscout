/*
  # Fix property_views RLS policy

  1. Updates
    - Update the RLS policy for the property_views table to correctly handle insertions
    - Ensures both authenticated and unauthenticated users can record property views with appropriate constraints
  
  2. Security
    - Maintains security by ensuring viewers can only set their own viewer_id if authenticated
    - Allows unauthenticated users to record views with null viewer_id
*/

-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Allow recording property views" ON property_views;

-- Create an improved policy with clearer conditions
CREATE POLICY "Allow recording property views" 
ON property_views
FOR INSERT
TO public
WITH CHECK (
  -- If user is authenticated, they can insert a record with their own ID or null
  ((auth.uid() IS NOT NULL) AND (viewer_id IS NULL OR viewer_id = auth.uid()))
  OR
  -- If user is not authenticated, they can only insert a record with null viewer_id
  (auth.uid() IS NULL AND viewer_id IS NULL)
);