/*
  # Storage bucket for property images
  
  1. New Storage Bucket
    - Creates 'property_images' public bucket for storing property images
  
  2. Security
    - Enables row-level security
    - Creates policies for uploading, updating, deleting, and viewing images
    - Ensures users can only manage their own images (in folders matching their user ID)
    - Allows public viewing of all images
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Make sure RLS is enabled on the objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own property images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Property images are publicly accessible" ON storage.objects;

-- Allow users to upload images to their own folder
CREATE POLICY "Users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property_images' AND
  auth.uid()::text = (SPLIT_PART(name, '/', 1))
);

-- Allow users to update only their own images
CREATE POLICY "Users can update their own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property_images' AND
  auth.uid()::text = (SPLIT_PART(name, '/', 1))
);

-- Allow users to delete only their own images
CREATE POLICY "Users can delete their own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property_images' AND
  auth.uid()::text = (SPLIT_PART(name, '/', 1))
);

-- Allow anyone to view images (both authenticated and public)
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property_images');