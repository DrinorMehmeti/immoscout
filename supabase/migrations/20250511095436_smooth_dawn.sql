/*
  # Create property-images storage bucket

  1. Changes
    - Creates the property-images storage bucket if it doesn't exist
    - Adds security policies for authenticated users to upload files and for public to view files

  This needs to be executed by an admin or service role account since bucket creation
  requires elevated permissions.
*/

-- Create the bucket if it doesn't exist (must be run as admin)
INSERT INTO storage.buckets (id, name, public)
SELECT 'property-images', 'property-images', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'property-images'
);

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload property images"
ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' AND 
  (storage.foldername(name))[1] = 'properties' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' AND 
  (storage.foldername(name))[1] = 'properties' AND
  (storage.foldername(name))[2] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'property-images' AND 
  (storage.foldername(name))[1] = 'properties' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' AND 
  (storage.foldername(name))[1] = 'properties' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow public access to read files (since bucket is public)
CREATE POLICY "Public can view property images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');