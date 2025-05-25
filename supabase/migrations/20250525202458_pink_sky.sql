-- First ensure RLS is enabled on property_views
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on property_views to start clean
DROP POLICY IF EXISTS "Allow recording property views" ON public.property_views;
DROP POLICY IF EXISTS "Property owners can view all views for their properties" ON public.property_views;
DROP POLICY IF EXISTS "Admins can view all property views" ON public.property_views;

-- 1. Policy for INSERT: Allow both authenticated and anonymous users to add views
CREATE POLICY "Allow recording property views" 
ON public.property_views
FOR INSERT
TO public
WITH CHECK (
  -- For authenticated users: ensure viewer_id is either NULL or matches their ID
  ((auth.uid() IS NOT NULL) AND (viewer_id IS NULL OR viewer_id = auth.uid()))
  OR
  -- For unauthenticated users: ensure viewer_id is NULL
  ((auth.uid() IS NULL) AND (viewer_id IS NULL))
);

-- 2. Policy for property owners to view statistics for their own properties
CREATE POLICY "Property owners can view all views for their properties" 
ON public.property_views
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM properties 
    WHERE properties.id = property_views.property_id 
    AND properties.owner_id = auth.uid()
  )
);

-- 3. Policy for administrators to have full access
CREATE POLICY "Admins can view all property views" 
ON public.property_views
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);