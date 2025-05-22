/*
  # Fix Property Views RLS Policy

  1. Changes
     - Drop the existing insert policy for property_views table
     - Create a new, more permissive insert policy that properly handles both authenticated and anonymous users
     - The policy ensures viewer_id is either NULL (for anonymous users) or matches the authenticated user's ID

  2. Security
     - Maintains security by ensuring users can only record views with their own ID or as anonymous
     - Prevents users from recording views with other users' IDs
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Anyone can add a property view" ON public.property_views;

-- Create a new, more explicit insert policy
CREATE POLICY "Allow recording property views" 
ON public.property_views
FOR INSERT 
TO public
WITH CHECK (
  -- For authenticated users, ensure viewer_id matches their ID if provided
  (auth.uid() IS NOT NULL AND (viewer_id IS NULL OR viewer_id = auth.uid()))
  OR
  -- For anonymous users, viewer_id must be NULL
  (auth.uid() IS NULL AND viewer_id IS NULL)
);