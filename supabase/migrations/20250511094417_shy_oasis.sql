/*
  # Fix Storage Bucket Policies for Public Access

  1. Ensures the bucket exists and is properly public
  2. Recreates all policies to fix permissions issues
  3. Explicitly enables public read access to all images
*/

-- Ensure the bucket exists and is marked as public
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove existing policies to start fresh
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Property images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;

-- Create clear policies with proper permissions
-- 1. Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- 2. Make ALL images in the property-images bucket publicly viewable
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- 3. Allow users to update only their own images
CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 4. Allow users to delete only their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);